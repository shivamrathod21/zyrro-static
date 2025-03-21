import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { Loader2, Pencil, Trash2 } from "lucide-react";

const formSchema = z.object({
  title: z.string().min(1, "Title is required"),
  slug: z.string().min(1, "Slug is required"),
  content: z.string().min(1, "Content is required"),
  excerpt: z.string().min(1, "Excerpt is required"),
  metaTitle: z.string().min(1, "Meta title is required"),
  metaDescription: z.string().min(1, "Meta description is required"),
  keywords: z.string().min(1, "Keywords are required"),
  coverImage: z.string().min(1, "Cover image URL is required"),
});

type FormValues = z.infer<typeof formSchema>;

export default function BlogManager() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      slug: "",
      content: "",
      excerpt: "",
      metaTitle: "",
      metaDescription: "",
      keywords: "",
      coverImage: "",
    },
  });

  // Fetch blog posts
  const { data: posts = [], isLoading } = useQuery({
    queryKey: ["/api/blog"],
    queryFn: () => apiRequest({
      url: "/api/blog",
      method: "GET",
    }),
  });

  // Create blog post
  const createMutation = useMutation({
    mutationFn: (data: FormValues) =>
      apiRequest({
        url: "/api/blog",
        method: "POST",
        data,
      }),
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Blog post created successfully",
      });
      form.reset();
      queryClient.invalidateQueries({ queryKey: ["/api/blog"] });
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to create blog post",
      });
      console.error(error);
    },
  });

  // Update blog post
  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: FormValues }) =>
      apiRequest({
        url: `/api/blog/${id}`,
        method: "PATCH",
        data,
      }),
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Blog post updated successfully",
      });
      setIsEditing(false);
      setEditingId(null);
      form.reset();
      queryClient.invalidateQueries({ queryKey: ["/api/blog"] });
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update blog post",
      });
      console.error(error);
    },
  });

  // Delete blog post
  const deleteMutation = useMutation({
    mutationFn: (id: number) =>
      apiRequest({
        url: `/api/blog/${id}`,
        method: "DELETE",
      }),
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Blog post deleted successfully",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/blog"] });
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to delete blog post",
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

  function handleEdit(post: any) {
    setIsEditing(true);
    setEditingId(post.id);
    form.reset({
      title: post.title,
      slug: post.slug,
      content: post.content,
      excerpt: post.excerpt,
      metaTitle: post.metaTitle,
      metaDescription: post.metaDescription,
      keywords: post.keywords,
      coverImage: post.coverImage,
    });
  }

  function handleDelete(id: number) {
    if (confirm("Are you sure you want to delete this blog post?")) {
      deleteMutation.mutate(id);
    }
  }

  function cancelEdit() {
    setIsEditing(false);
    setEditingId(null);
    form.reset();
  }

  return (
    <div className="space-y-8">
      <Card className="bg-zinc-900 border-zinc-800 text-white">
        <CardHeader>
          <CardTitle className="text-xl font-bold">
            {isEditing ? "Edit Blog Post" : "Create New Blog Post"}
          </CardTitle>
          <CardDescription className="text-zinc-400">
            {isEditing
              ? "Update your blog post details and SEO settings"
              : "Add a new blog post with SEO optimization"}
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
                    <FormLabel>Title</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter blog post title"
                        className="bg-zinc-800 border-zinc-700"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="slug"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Slug</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter URL-friendly slug"
                        className="bg-zinc-800 border-zinc-700"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="content"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Content</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Write your blog post content"
                        className="bg-zinc-800 border-zinc-700 min-h-[200px]"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="excerpt"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Excerpt</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Enter a short excerpt"
                        className="bg-zinc-800 border-zinc-700"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="space-y-4 border-t border-zinc-800 pt-4 mt-4">
                <h3 className="text-lg font-semibold">SEO Settings</h3>
                <FormField
                  control={form.control}
                  name="metaTitle"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Meta Title</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter SEO meta title"
                          className="bg-zinc-800 border-zinc-700"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="metaDescription"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Meta Description</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Enter SEO meta description"
                          className="bg-zinc-800 border-zinc-700"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="keywords"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Keywords</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter comma-separated keywords"
                          className="bg-zinc-800 border-zinc-700"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="coverImage"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Cover Image URL</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter cover image URL"
                          className="bg-zinc-800 border-zinc-700"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="flex gap-2 pt-4">
                <Button type="submit" className="bg-yellow-500 text-black hover:bg-yellow-600">
                  {isEditing ? "Update Post" : "Create Post"}
                </Button>
                {isEditing && (
                  <Button
                    type="button"
                    variant="outline"
                    className="border-zinc-700"
                    onClick={cancelEdit}
                  >
                    Cancel
                  </Button>
                )}
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>

      <div className="space-y-4">
        <h2 className="text-xl font-bold">Blog Posts</h2>
        {isLoading ? (
          <div className="flex justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-yellow-500" />
          </div>
        ) : posts.length === 0 ? (
          <p className="text-zinc-400 text-center py-8">No blog posts yet</p>
        ) : (
          <div className="grid gap-4">
            {posts.map((post: any) => (
              <Card key={post.id} className="bg-zinc-900 border-zinc-800 text-white">
                <CardContent className="flex items-center justify-between p-6">
                  <div>
                    <h3 className="font-semibold">{post.title}</h3>
                    <p className="text-zinc-400 text-sm mt-1">{post.excerpt}</p>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="icon"
                      className="border-zinc-700"
                      onClick={() => handleEdit(post)}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="destructive"
                      size="icon"
                      onClick={() => handleDelete(post.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}