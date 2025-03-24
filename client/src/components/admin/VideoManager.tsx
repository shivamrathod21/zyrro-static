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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

// Form schema
const formSchema = z.object({
  section: z.enum(["hero", "portfolio", "before_after"]),
  title: z.string().min(3, {
    message: "Title must be at least 3 characters.",
  }),
  description: z.string().optional(),
  videoUrl: z.string().url({
    message: "Please enter a valid URL for the video.",
  }).optional(),
  beforeVideoUrl: z.string().url({
    message: "Please enter a valid URL for the before video.",
  }).optional(),
  afterVideoUrl: z.string().url({
    message: "Please enter a valid URL for the after video.",
  }).optional(),
  thumbnailUrl: z.string().url({
    message: "Please enter a valid URL for the thumbnail.",
  }).optional(),
  active: z.boolean().default(true)
});

// Conditional schema validation based on section
const validateFormData = (data: any) => {
  if (data.section === "before_after") {
    if (!data.beforeVideoUrl) {
      throw new Error("Before Video URL is required for Before & After section");
    }
    if (!data.afterVideoUrl) {
      throw new Error("After Video URL is required for Before & After section");
    }
  } else if (!data.videoUrl) {
    throw new Error("Video URL is required for this section");
  }
  return data;
}

type FormValues = z.infer<typeof formSchema>;

export default function VideoManager() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      section: "hero",
      title: "",
      description: "",
      videoUrl: "",
      beforeVideoUrl: "",
      afterVideoUrl: "",
      thumbnailUrl: "",
      active: true
    },
  });

  // Fetch video content
  const { data: videoItems = [], isLoading } = useQuery({
    queryKey: ["/api/video-content"],
    queryFn: () => apiRequest({
      url: "/api/video-content",
      method: "GET",
    }),
  });

  // Create video content
  const createMutation = useMutation({
    mutationFn: (data: FormValues) => 
      apiRequest({
        url: "/api/video-content",
        method: "POST",
        data,
      }),
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Video content created successfully",
      });
      form.reset();
      queryClient.invalidateQueries({ queryKey: ["/api/video-content"] });
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to create video content",
      });
      console.error(error);
    },
  });

  // Update video content
  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: FormValues }) =>
      apiRequest({
        url: `/api/video-content/${id}`,
        method: "PATCH",
        data,
      }),
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Video content updated successfully",
      });
      setIsEditing(false);
      setEditingId(null);
      form.reset();
      queryClient.invalidateQueries({ queryKey: ["/api/video-content"] });
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update video content",
      });
      console.error(error);
    },
  });

  // Delete video content
  const deleteMutation = useMutation({
    mutationFn: (id: number) =>
      apiRequest({
        url: `/api/video-content/${id}`,
        method: "DELETE",
      }),
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Video content deleted successfully",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/video-content"] });
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to delete video content",
      });
      console.error(error);
    },
  });

  const onSubmit = (data: FormValues) => {
    try {
      // Validate form data based on section
      validateFormData(data);
      
      if (isEditing && editingId) {
        updateMutation.mutate({ id: editingId, data });
      } else {
        createMutation.mutate(data);
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Validation Error",
        description: error instanceof Error ? error.message : "Please check your form inputs",
      });
    }
  };

  const handleEdit = (item: any) => {
    setIsEditing(true);
    setEditingId(item.id);
    form.reset({
      section: item.section,
      title: item.title,
      description: item.description || "",
      videoUrl: item.videoUrl || "",
      beforeVideoUrl: item.beforeVideoUrl || "",
      afterVideoUrl: item.afterVideoUrl || "",
      thumbnailUrl: item.thumbnailUrl || "",
      active: item.active
    });
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditingId(null);
    form.reset();
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin text-yellow-500" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Video Content Management</CardTitle>
          <CardDescription>
            Manage video content across different sections of the website.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="section"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Section</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a section" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="hero">Hero</SelectItem>
                        <SelectItem value="portfolio">Portfolio</SelectItem>
                        <SelectItem value="before_after">Before & After</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Title</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter title" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Enter description"
                        className="resize-none"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {form.watch('section') !== 'before_after' ? (
                <FormField
                  control={form.control}
                  name="videoUrl"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Video URL</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter video URL" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              ) : (
                <>
                  <FormField
                    control={form.control}
                    name="beforeVideoUrl"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Before Video URL</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter before video URL" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="afterVideoUrl"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>After Video URL</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter after video URL" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </>
              )}

              <FormField
                control={form.control}
                name="thumbnailUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Thumbnail URL (optional)</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter thumbnail URL" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="active"
                render={({ field }) => (
                  <FormItem className="flex items-center space-x-2">
                    <FormControl>
                      <input
                        type="checkbox"
                        checked={field.value}
                        onChange={field.onChange}
                        className="h-4 w-4"
                      />
                    </FormControl>
                    <FormLabel className="!mt-0">Active</FormLabel>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex justify-end space-x-2">
                {isEditing && (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleCancel}
                  >
                    Cancel
                  </Button>
                )}
                <Button type="submit" disabled={createMutation.isPending || updateMutation.isPending}>
                  {isEditing ? "Update" : "Create"}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {videoItems.map((item: any) => (
          <Card key={item.id}>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>{item.title}</span>
                <div className="flex space-x-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleEdit(item)}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => deleteMutation.mutate(item.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardTitle>
              <CardDescription>{item.section}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="aspect-video rounded-lg overflow-hidden bg-zinc-950">
                <video
                  src={item.videoUrl}
                  className="w-full h-full object-cover"
                  controls
                />
              </div>
              {item.description && (
                <p className="mt-2 text-sm text-gray-500">{item.description}</p>
              )}
            </CardContent>
            <CardFooter>
              <div className="flex items-center space-x-2">
                <span className={`h-2 w-2 rounded-full ${item.active ? 'bg-green-500' : 'bg-red-500'}`} />
                <span className="text-sm">{item.active ? 'Active' : 'Inactive'}</span>
              </div>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}