import { useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Pencil, Trash2, Plus, X, Check, Loader2 } from "lucide-react";

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

// Form schema
const formSchema = z.object({
  title: z.string().min(3, {
    message: "Title must be at least 3 characters.",
  }),
  description: z.string().min(10, {
    message: "Description must be at least 10 characters.",
  }),
  category: z.string().min(3, {
    message: "Category must be at least 3 characters.",
  }),
  imageSrc: z.string().url({
    message: "Please enter a valid URL for the image.",
  }),
});

type FormValues = z.infer<typeof formSchema>;

export default function PortfolioManager() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
      category: "",
      imageSrc: "",
    },
  });

  // Fetch portfolio items
  const { data: portfolioItems = [], isLoading } = useQuery({
    queryKey: ['/api/portfolio'],
    queryFn: () => apiRequest({
      url: '/api/portfolio',
      method: 'GET',
    }),
  });

  // Create portfolio item
  const createMutation = useMutation({
    mutationFn: (data: FormValues) => 
      apiRequest({
        url: "/api/portfolio",
        method: "POST",
        data,
      }),
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Portfolio item created successfully",
      });
      form.reset();
      queryClient.invalidateQueries({ queryKey: ['/api/portfolio'] });
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to create portfolio item",
      });
      console.error(error);
    },
  });

  // Update portfolio item
  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number, data: FormValues }) => 
      apiRequest({
        url: `/api/portfolio/${id}`,
        method: "PATCH",
        data,
      }),
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Portfolio item updated successfully",
      });
      setIsEditing(false);
      setEditingId(null);
      form.reset();
      queryClient.invalidateQueries({ queryKey: ['/api/portfolio'] });
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update portfolio item",
      });
      console.error(error);
    },
  });

  // Delete portfolio item
  const deleteMutation = useMutation({
    mutationFn: (id: number) => 
      apiRequest({
        url: `/api/portfolio/${id}`,
        method: "DELETE",
      }),
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Portfolio item deleted successfully",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/portfolio'] });
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to delete portfolio item",
      });
      console.error(error);
    },
  });

  function onSubmit(data: FormValues) {
    if (isEditing && editingId) {
      updateMutation.mutate({ id: editingId, data });
    } else {
      createMutation.mutate(data);
    }
  }

  function handleEdit(item: any) {
    setIsEditing(true);
    setEditingId(item.id);
    form.reset({
      title: item.title,
      description: item.description,
      category: item.category,
      imageSrc: item.imageSrc,
    });
  }

  function handleDelete(id: number) {
    if (confirm("Are you sure you want to delete this portfolio item?")) {
      deleteMutation.mutate(id);
    }
  }

  function cancelEdit() {
    setIsEditing(false);
    setEditingId(null);
    form.reset();
  }

  return (
    <>
      <Card className="bg-zinc-900 border-zinc-800 text-white mb-8">
        <CardHeader>
          <CardTitle className="text-xl font-bold">
            {isEditing ? "Edit Portfolio Item" : "Add New Portfolio Item"}
          </CardTitle>
          <CardDescription className="text-zinc-400">
            {isEditing 
              ? "Update the details of the portfolio item" 
              : "Add a new project to your portfolio showcase"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-zinc-300">Project Title</FormLabel>
                    <FormControl>
                      <Input 
                        {...field} 
                        className="bg-zinc-800 border-zinc-700 text-white" 
                        placeholder="Enter project title"
                      />
                    </FormControl>
                    <FormMessage className="text-red-400" />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-zinc-300">Category</FormLabel>
                    <FormControl>
                      <Input 
                        {...field} 
                        className="bg-zinc-800 border-zinc-700 text-white" 
                        placeholder="E.g. Cinematic, Gameplay, Montage"
                      />
                    </FormControl>
                    <FormMessage className="text-red-400" />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-zinc-300">Description</FormLabel>
                    <FormControl>
                      <Textarea 
                        {...field} 
                        className="bg-zinc-800 border-zinc-700 text-white resize-none min-h-[100px]" 
                        placeholder="Enter project description"
                      />
                    </FormControl>
                    <FormMessage className="text-red-400" />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="imageSrc"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-zinc-300">Image URL</FormLabel>
                    <FormControl>
                      <Input 
                        {...field} 
                        className="bg-zinc-800 border-zinc-700 text-white" 
                        placeholder="https://example.com/image.jpg"
                      />
                    </FormControl>
                    <FormMessage className="text-red-400" />
                  </FormItem>
                )}
              />

              <div className="flex gap-2 pt-2">
                {isEditing ? (
                  <>
                    <Button 
                      type="submit" 
                      className="bg-yellow-500 hover:bg-yellow-600 text-black flex-1"
                      disabled={updateMutation.isPending}
                    >
                      {updateMutation.isPending ? (
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      ) : (
                        <Check className="h-4 w-4 mr-2" />
                      )}
                      Update Item
                    </Button>
                    <Button 
                      type="button" 
                      variant="outline" 
                      className="border-zinc-700 text-zinc-300"
                      onClick={cancelEdit}
                    >
                      <X className="h-4 w-4 mr-2" />
                      Cancel
                    </Button>
                  </>
                ) : (
                  <Button 
                    type="submit" 
                    className="bg-yellow-500 hover:bg-yellow-600 text-black flex-1"
                    disabled={createMutation.isPending}
                  >
                    {createMutation.isPending ? (
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    ) : (
                      <Plus className="h-4 w-4 mr-2" />
                    )}
                    Add Portfolio Item
                  </Button>
                )}
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>

      <Card className="bg-zinc-900 border-zinc-800 text-white">
        <CardHeader>
          <CardTitle className="text-xl font-bold">Portfolio Items</CardTitle>
          <CardDescription className="text-zinc-400">
            Manage your portfolio showcase
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-yellow-500" />
            </div>
          ) : portfolioItems.length === 0 ? (
            <div className="text-center py-8 text-zinc-400">
              No portfolio items found. Add your first item above.
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {portfolioItems.map((item: any) => (
                <div key={item.id} className="flex flex-col md:flex-row gap-4 p-4 border border-zinc-800 rounded-lg">
                  <div className="md:w-1/4">
                    <img 
                      src={item.imageSrc} 
                      alt={item.title} 
                      className="w-full h-32 object-cover rounded-md"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = "https://placehold.co/600x400/222/aaa?text=Image+Not+Found";
                      }}
                    />
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-bold text-lg">{item.title}</h3>
                        <span className="inline-block bg-zinc-800 px-2 py-1 rounded text-xs text-yellow-500 mb-2">
                          {item.category}
                        </span>
                      </div>
                      <div className="flex gap-2">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="h-8 w-8 p-0 border-zinc-700"
                          onClick={() => handleEdit(item)}
                        >
                          <Pencil className="h-4 w-4" />
                          <span className="sr-only">Edit</span>
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="h-8 w-8 p-0 border-zinc-700 hover:bg-red-900 hover:text-red-300 hover:border-red-800"
                          onClick={() => handleDelete(item.id)}
                          disabled={deleteMutation.isPending}
                        >
                          {deleteMutation.isPending ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <Trash2 className="h-4 w-4" />
                          )}
                          <span className="sr-only">Delete</span>
                        </Button>
                      </div>
                    </div>
                    <p className="text-zinc-400 text-sm line-clamp-2">{item.description}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </>
  );
}