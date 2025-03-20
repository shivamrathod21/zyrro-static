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
  name: z.string().min(3, {
    message: "Name must be at least 3 characters.",
  }),
  subscribers: z.string().min(1, {
    message: "Subscribers count is required.",
  }),
  testimonial: z.string().min(10, {
    message: "Testimonial must be at least 10 characters.",
  }),
  avatar: z.string().url({
    message: "Please enter a valid URL for the avatar.",
  }),
});

type FormValues = z.infer<typeof formSchema>;

export default function CreatorsManager() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      subscribers: "",
      testimonial: "",
      avatar: "",
    },
  });

  // Fetch creators
  const { data: creators = [], isLoading } = useQuery({
    queryKey: ['/api/creators'],
    queryFn: () => apiRequest({
      url: '/api/creators',
      method: 'GET',
    }),
  });

  // Create creator
  const createMutation = useMutation({
    mutationFn: (data: FormValues) => 
      apiRequest({
        url: "/api/creators",
        method: "POST",
        data,
      }),
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Creator added successfully",
      });
      form.reset();
      queryClient.invalidateQueries({ queryKey: ['/api/creators'] });
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to add creator",
      });
      console.error(error);
    },
  });

  // Update creator
  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number, data: FormValues }) => 
      apiRequest({
        url: `/api/creators/${id}`,
        method: "PATCH",
        data,
      }),
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Creator updated successfully",
      });
      setIsEditing(false);
      setEditingId(null);
      form.reset();
      queryClient.invalidateQueries({ queryKey: ['/api/creators'] });
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update creator",
      });
      console.error(error);
    },
  });

  // Delete creator
  const deleteMutation = useMutation({
    mutationFn: (id: number) => 
      apiRequest({
        url: `/api/creators/${id}`,
        method: "DELETE",
      }),
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Creator deleted successfully",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/creators'] });
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to delete creator",
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
      name: item.name,
      subscribers: item.subscribers,
      testimonial: item.testimonial,
      avatar: item.avatar,
    });
  }

  function handleDelete(id: number) {
    if (confirm("Are you sure you want to delete this creator?")) {
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
            {isEditing ? "Edit Creator" : "Add New Creator"}
          </CardTitle>
          <CardDescription className="text-zinc-400">
            {isEditing 
              ? "Update the details of the creator" 
              : "Add a new gaming creator to showcase"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-zinc-300">Creator Name</FormLabel>
                    <FormControl>
                      <Input 
                        {...field} 
                        className="bg-zinc-800 border-zinc-700 text-white" 
                        placeholder="Enter creator name"
                      />
                    </FormControl>
                    <FormMessage className="text-red-400" />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="subscribers"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-zinc-300">Subscribers/Followers</FormLabel>
                    <FormControl>
                      <Input 
                        {...field} 
                        className="bg-zinc-800 border-zinc-700 text-white" 
                        placeholder="E.g. 1.2M, 500K"
                      />
                    </FormControl>
                    <FormMessage className="text-red-400" />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="testimonial"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-zinc-300">Testimonial Quote</FormLabel>
                    <FormControl>
                      <Textarea 
                        {...field} 
                        className="bg-zinc-800 border-zinc-700 text-white resize-none min-h-[100px]" 
                        placeholder="Enter creator testimonial"
                      />
                    </FormControl>
                    <FormMessage className="text-red-400" />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="avatar"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-zinc-300">Avatar URL</FormLabel>
                    <FormControl>
                      <Input 
                        {...field} 
                        className="bg-zinc-800 border-zinc-700 text-white" 
                        placeholder="https://example.com/avatar.jpg"
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
                      Update Creator
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
                    Add Creator
                  </Button>
                )}
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>

      <Card className="bg-zinc-900 border-zinc-800 text-white">
        <CardHeader>
          <CardTitle className="text-xl font-bold">Creators</CardTitle>
          <CardDescription className="text-zinc-400">
            Manage your featured gaming creators
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-yellow-500" />
            </div>
          ) : creators.length === 0 ? (
            <div className="text-center py-8 text-zinc-400">
              No creators found. Add your first creator above.
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {creators.map((creator: any) => (
                <div key={creator.id} className="flex flex-col sm:flex-row gap-4 p-4 border border-zinc-800 rounded-lg">
                  <div className="flex-shrink-0">
                    <img 
                      src={creator.avatar} 
                      alt={creator.name} 
                      className="w-16 h-16 rounded-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = "https://placehold.co/200x200/222/aaa?text=Avatar";
                      }}
                    />
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-bold text-lg">{creator.name}</h3>
                        <span className="inline-block bg-zinc-800 px-2 py-1 rounded text-xs text-yellow-500">
                          {creator.subscribers} subscribers
                        </span>
                      </div>
                      <div className="flex gap-2">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="h-8 w-8 p-0 border-zinc-700"
                          onClick={() => handleEdit(creator)}
                        >
                          <Pencil className="h-4 w-4" />
                          <span className="sr-only">Edit</span>
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="h-8 w-8 p-0 border-zinc-700 hover:bg-red-900 hover:text-red-300 hover:border-red-800"
                          onClick={() => handleDelete(creator.id)}
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
                    <p className="text-zinc-400 text-sm mt-2">"{creator.testimonial}"</p>
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