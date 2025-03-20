import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { format } from "date-fns";
import { Loader2, Eye, Check, X } from "lucide-react";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

export default function BookingsManager() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [viewingBooking, setViewingBooking] = useState<any>(null);
  const [statusChangeBooking, setStatusChangeBooking] = useState<any>(null);
  const [newStatus, setNewStatus] = useState<string>("");

  // Fetch bookings
  const { data: bookings = [], isLoading } = useQuery({
    queryKey: ['/api/bookings'],
    queryFn: () => apiRequest({
      url: '/api/bookings',
      method: 'GET',
    }),
  });

  // Update booking status
  const updateStatusMutation = useMutation({
    mutationFn: ({ id, status }: { id: number, status: string }) => 
      apiRequest({
        url: `/api/bookings/${id}/status`,
        method: "PATCH",
        data: { status },
      }),
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Booking status updated successfully",
      });
      setStatusChangeBooking(null);
      queryClient.invalidateQueries({ queryKey: ['/api/bookings'] });
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update booking status",
      });
      console.error(error);
    },
  });

  function handleViewBooking(booking: any) {
    setViewingBooking(booking);
  }

  function handleStatusChange(id: number, status: string) {
    const booking = bookings.find((b: any) => b.id === id);
    setStatusChangeBooking(booking);
    setNewStatus(status);
  }

  function saveStatusChange() {
    if (statusChangeBooking && newStatus) {
      updateStatusMutation.mutate({ 
        id: statusChangeBooking.id, 
        status: newStatus 
      });
    }
  }

  function cancelStatusChange() {
    setStatusChangeBooking(null);
    setNewStatus("");
  }

  function formatDate(dateString: string) {
    try {
      return format(new Date(dateString), 'PPP');
    } catch (error) {
      return dateString;
    }
  }

  // Map status to badge style
  const getStatusBadge = (status: string) => {
    const statusStyles = {
      pending: "bg-yellow-900 text-yellow-300",
      approved: "bg-green-900 text-green-300",
      completed: "bg-blue-900 text-blue-300", 
      rejected: "bg-red-900 text-red-300",
      cancelled: "bg-zinc-700 text-zinc-300"
    } as Record<string, string>;

    return statusStyles[status.toLowerCase()] || "bg-zinc-800 text-zinc-300";
  };

  return (
    <>
      <Card className="bg-zinc-900 border-zinc-800 text-white">
        <CardHeader>
          <CardTitle className="text-xl font-bold">Project Inquiries</CardTitle>
          <CardDescription className="text-zinc-400">
            Manage client project requests and inquiries
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-yellow-500" />
            </div>
          ) : bookings.length === 0 ? (
            <div className="text-center py-8 text-zinc-400">
              No project inquiries found.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-zinc-800 text-left">
                    <th className="pb-3 font-medium text-zinc-400">Date</th>
                    <th className="pb-3 font-medium text-zinc-400">Name</th>
                    <th className="pb-3 font-medium text-zinc-400">Service</th>
                    <th className="pb-3 font-medium text-zinc-400">Status</th>
                    <th className="pb-3 font-medium text-zinc-400">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {bookings.map((booking: any) => (
                    <tr key={booking.id} className="border-b border-zinc-800">
                      <td className="py-3 text-sm">{formatDate(booking.createdAt)}</td>
                      <td className="py-3 text-sm">{booking.name}</td>
                      <td className="py-3 text-sm">{booking.serviceType}</td>
                      <td className="py-3 text-sm">
                        <span className={`px-2 py-1 rounded text-xs ${getStatusBadge(booking.status)}`}>
                          {booking.status}
                        </span>
                      </td>
                      <td className="py-3 text-sm">
                        <div className="flex gap-2">
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="h-8 w-8 p-0 border-zinc-700"
                            onClick={() => handleViewBooking(booking)}
                          >
                            <Eye className="h-4 w-4" />
                            <span className="sr-only">View</span>
                          </Button>
                          <Select 
                            value={booking.status}
                            onValueChange={(value) => handleStatusChange(booking.id, value)}
                          >
                            <SelectTrigger className="h-8 w-24 bg-zinc-800 border-zinc-700 text-xs">
                              <SelectValue placeholder="Status" />
                            </SelectTrigger>
                            <SelectContent className="bg-zinc-800 border-zinc-700">
                              <SelectItem value="pending">Pending</SelectItem>
                              <SelectItem value="approved">Approved</SelectItem>
                              <SelectItem value="completed">Completed</SelectItem>
                              <SelectItem value="rejected">Rejected</SelectItem>
                              <SelectItem value="cancelled">Cancelled</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Booking Details Dialog */}
      <Dialog open={!!viewingBooking} onOpenChange={(open) => !open && setViewingBooking(null)}>
        <DialogContent className="bg-zinc-900 border-zinc-800 text-white">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold">Booking Details</DialogTitle>
            <DialogDescription className="text-zinc-400">
              Project inquiry information
            </DialogDescription>
          </DialogHeader>
          
          {viewingBooking && (
            <div className="space-y-4 my-2">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="text-sm font-medium text-zinc-400">Client Name</h4>
                  <p className="text-white">{viewingBooking.name}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-zinc-400">Email</h4>
                  <p className="text-white">{viewingBooking.email}</p>
                </div>
              </div>
              
              <div>
                <h4 className="text-sm font-medium text-zinc-400">Service Type</h4>
                <p className="text-white">{viewingBooking.serviceType}</p>
              </div>
              
              <div>
                <h4 className="text-sm font-medium text-zinc-400">Channel/Platform</h4>
                <p className="text-white">{viewingBooking.channel}</p>
              </div>

              <div>
                <h4 className="text-sm font-medium text-zinc-400">Budget Range</h4>
                <p className="text-white">{viewingBooking.budgetRange}</p>
              </div>
              
              <div>
                <h4 className="text-sm font-medium text-zinc-400">Project Details</h4>
                <p className="text-zinc-300 whitespace-pre-wrap text-sm">{viewingBooking.projectDetails}</p>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="text-sm font-medium text-zinc-400">Submission Date</h4>
                  <p className="text-white">{formatDate(viewingBooking.createdAt)}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-zinc-400">Status</h4>
                  <span className={`px-2 py-1 rounded text-xs ${getStatusBadge(viewingBooking.status)}`}>
                    {viewingBooking.status}
                  </span>
                </div>
              </div>
            </div>
          )}
          
          <DialogFooter>
            <Button 
              variant="outline" 
              className="border-zinc-700 text-zinc-300"
              onClick={() => setViewingBooking(null)}
            >
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Status Change Confirmation Dialog */}
      <Dialog open={!!statusChangeBooking} onOpenChange={(open) => !open && cancelStatusChange()}>
        <DialogContent className="bg-zinc-900 border-zinc-800 text-white">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold">Change Status</DialogTitle>
            <DialogDescription className="text-zinc-400">
              Are you sure you want to change the status?
            </DialogDescription>
          </DialogHeader>
          
          {statusChangeBooking && (
            <div className="space-y-4 my-4">
              <div>
                <h4 className="text-sm font-medium text-zinc-400">Client</h4>
                <p className="text-white">{statusChangeBooking.name}</p>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="text-sm font-medium text-zinc-400">Current Status</h4>
                  <span className={`px-2 py-1 rounded text-xs ${getStatusBadge(statusChangeBooking.status)}`}>
                    {statusChangeBooking.status}
                  </span>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-zinc-400">New Status</h4>
                  <span className={`px-2 py-1 rounded text-xs ${getStatusBadge(newStatus)}`}>
                    {newStatus}
                  </span>
                </div>
              </div>
            </div>
          )}
          
          <DialogFooter className="flex gap-2">
            <Button 
              variant="outline" 
              className="border-zinc-700 text-zinc-300"
              onClick={cancelStatusChange}
            >
              <X className="h-4 w-4 mr-2" />
              Cancel
            </Button>
            <Button 
              className="bg-yellow-500 hover:bg-yellow-600 text-black"
              onClick={saveStatusChange}
              disabled={updateStatusMutation.isPending}
            >
              {updateStatusMutation.isPending ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <Check className="h-4 w-4 mr-2" />
              )}
              Confirm Change
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}