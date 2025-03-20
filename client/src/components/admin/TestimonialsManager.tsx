import { useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Pencil, Trash2, Plus, X, Check, Loader2, Star } from "lucide-react";

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

// Form schema
const formSchema = z.object({
  author: z.string().min(3, {
    message: "Author name must be at least 3 characters.",
  }),
  role: z.string().min(3, {
    message: "Role must be at least 3 characters.",
  }),
  quote: z.string().min(10, {
    message: "Quote must be at least 10 characters.",
  }),
  avatar: z.string().url({
    message: "Please enter a valid URL for the avatar.",
  }),
  rating: z.coerce.number().min(1).max(5),
  creatorId: z.coerce.number().optional(),
});

type FormValues = z.infer<typeof formSchema>;

export default function TestimonialsManager() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      author: "",
      role: "",
      quote: "",
      avatar: "",
      rating: 5,
    },
  });

  // Fetch testimonials
  const { data: testimonials = [], isLoading: isLoadingTestimonials } = useQuery({
    queryKey: ['/api/testimonials'],
    queryFn: () => apiRequest({
      url: '/api/testimonials',
      method: 'GET',
    }),
  });

  // Fetch creators for select dropdown
  const { data: creators = [], isLoading: isLoadingCreators } = useQuery({
    queryKey: ['/api/creators'],
    queryFn: () => apiRequest({
      url: '/api/creators',
      method: 'GET',
    }),
  });

  // Create testimonial
  const createMutation = useMutation({
    mutationFn: (data: FormValues) => 
      apiRequest({
        url: "/api/testimonials",
        method: "POST",
        data,
      }),
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Testimonial added successfully",
      });
      form.reset({
        author: "",
        role: "",
        quote: "",
        avatar: "",
        rating: 5,
      });
      queryClient.invalidateQueries({ queryKey: ['/api/testimonials'] });
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to add testimonial",
      });
      console.error(error);
    },
  });

  // Update testimonial
  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number, data: FormValues }) => 
      apiRequest({
        url: `/api/testimonials/${id}`,
        method: "PATCH",
        data,
      }),
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Testimonial updated successfully",
      });
      setIsEditing(false);
      setEditingId(null);
      form.reset({
        author: "",
        role: "",
        quote: "",
        avatar: "",
        rating: 5,
      });
      queryClient.invalidateQueries({ queryKey: ['/api/testimonials'] });
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update testimonial",
      });
      console.error(error);
    },
  });

  // Delete testimonial
  const deleteMutation = useMutation({
    mutationFn: (id: number) => 
      apiRequest({
        url: `/api/testimonials/${id}`,
        method: "DELETE",
      }),
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Testimonial deleted successfully",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/testimonials'] });
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to delete testimonial",
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
      author: item.author,
      role: item.role,
      quote: item.quote,
      avatar: item.avatar,
      rating: item.rating,
      creatorId: item.creatorId,
    });
  }

  function handleDelete(id: number) {
    if (confirm("Are you sure you want to delete this testimonial?")) {
      deleteMutation.mutate(id);
    }
  }

  function cancelEdit() {
    setIsEditing(false);
    setEditingId(null);
    form.reset({
      author: "",
      role: "",
      quote: "",
      avatar: "",
      rating: 5,
    });
  }

  function getCreatorNameById(id: number) {
    const creator = creators.find((c: any) => c.id === id);
    return creator ? creator.name : "Unknown";
  }

  function renderRating(rating: number) {
    return Array(5)
      .fill(0)
      .map((_, i) => (
        <Star 
          key={i} 
          className={`h-4 w-4 ${i < rating ? "fill-yellow-500 text-yellow-500" : "text-zinc-600"}`} 
        />
      ));
  }

  return (
    <>
      <Card className="bg-zinc-900 border-zinc-800 text-white mb-8">
        <CardHeader>
          <CardTitle className="text-xl font-bold">
            {isEditing ? "Edit Testimonial" : "Add New Testimonial"}
          </CardTitle>
          <CardDescription className="text-zinc-400">
            {isEditing 
              ? "Update the details of the testimonial" 
              : "Add a new client testimonial"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="author"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-zinc-300">Author Name</FormLabel>
                    <FormControl>
                      <Input 
                        {...field} 
                        className="bg-zinc-800 border-zinc-700 text-white" 
                        placeholder="Enter author name"
                      />
                    </FormControl>
                    <FormMessage className="text-red-400" />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="role"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-zinc-300">Role/Position</FormLabel>
                    <FormControl>
                      <Input 
                        {...field} 
                        className="bg-zinc-800 border-zinc-700 text-white" 
                        placeholder="E.g. YouTube Creator, Streamer"
                      />
                    </FormControl>
                    <FormMessage className="text-red-400" />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="quote"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-zinc-300">Quote</FormLabel>
                    <FormControl>
                      <Textarea 
                        {...field} 
                        className="bg-zinc-800 border-zinc-700 text-white resize-none min-h-[100px]" 
                        placeholder="Enter testimonial quote"
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

              <FormField
                control={form.control}
                name="rating"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-zinc-300">Rating (1-5)</FormLabel>
                    <div className="flex items-center gap-4">
                      <FormControl>
                        <Slider
                          min={1}
                          max={5}
                          step={1}
                          value={[field.value]}
                          onValueChange={(value) => field.onChange(value[0])}
                          className="w-full"
                        />
                      </FormControl>
                      <div className="flex bg-zinc-800 border border-zinc-700 rounded p-1">
                        {field.value}
                      </div>
                    </div>
                    <div className="flex mt-1">
                      {renderRating(field.value)}
                    </div>
                    <FormMessage className="text-red-400" />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="creatorId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-zinc-300">Link to Creator (Optional)</FormLabel>
                    <Select
                      onValueChange={(value) => field.onChange(Number(value) || undefined)}
                      value={field.value?.toString() || ""}
                    >
                      <FormControl>
                        <SelectTrigger className="bg-zinc-800 border-zinc-700 text-white">
                          <SelectValue placeholder="Select a creator" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="bg-zinc-800 border-zinc-700 text-white">
                        <SelectItem value="">None</SelectItem>
                        {creators.map((creator: any) => (
                          <SelectItem key={creator.id} value={creator.id.toString()}>
                            {creator.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
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
                      Update Testimonial
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
                    Add Testimonial
                  </Button>
                )}
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>

      <Card className="bg-zinc-900 border-zinc-800 text-white">
        <CardHeader>
          <CardTitle className="text-xl font-bold">Testimonials</CardTitle>
          <CardDescription className="text-zinc-400">
            Manage your client testimonials
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoadingTestimonials || isLoadingCreators ? (
            <div className="flex justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-yellow-500" />
            </div>
          ) : testimonials.length === 0 ? (
            <div className="text-center py-8 text-zinc-400">
              No testimonials found. Add your first testimonial above.
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {testimonials.map((testimonial: any) => (
                <div key={testimonial.id} className="flex flex-col sm:flex-row gap-4 p-4 border border-zinc-800 rounded-lg">
                  <div className="flex-shrink-0">
                    <img 
                      src={testimonial.avatar} 
                      alt={testimonial.author} 
                      className="w-16 h-16 rounded-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = "https://placehold.co/200x200/222/aaa?text=Avatar";
                      }}
                    />
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-bold text-lg">{testimonial.author}</h3>
                        <div className="flex items-center gap-2">
                          <span className="text-zinc-400 text-sm">{testimonial.role}</span>
                          {testimonial.creatorId && (
                            <span className="inline-block bg-zinc-800 px-2 py-0.5 rounded text-xs text-yellow-500">
                              Creator: {getCreatorNameById(testimonial.creatorId)}
                            </span>
                          )}
                        </div>
                        <div className="flex mt-1">
                          {renderRating(testimonial.rating)}
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="h-8 w-8 p-0 border-zinc-700"
                          onClick={() => handleEdit(testimonial)}
                        >
                          <Pencil className="h-4 w-4" />
                          <span className="sr-only">Edit</span>
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="h-8 w-8 p-0 border-zinc-700 hover:bg-red-900 hover:text-red-300 hover:border-red-800"
                          onClick={() => handleDelete(testimonial.id)}
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
                    <p className="text-zinc-400 text-sm mt-2">"{testimonial.quote}"</p>
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