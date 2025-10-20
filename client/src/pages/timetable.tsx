
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { queryClient } from "@/lib/queryClient";
import { GlassCard } from "@/components/glass-card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Upload, Calendar, FileText, Plus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

export default function Timetable() {
  const [isUploadTimetableOpen, setIsUploadTimetableOpen] = useState(false);
  const [isUploadAssignmentOpen, setIsUploadAssignmentOpen] = useState(false);
  const [timetableFile, setTimetableFile] = useState<File | null>(null);
  const [assignmentFile, setAssignmentFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const { toast } = useToast();

  const { data: scheduleEvents = [] } = useQuery({
    queryKey: ["/api/schedule"],
  });

  const { data: timetableData } = useQuery({
    queryKey: ["/api/timetable"],
  });

  const handleTimetableUpload = async () => {
    if (!timetableFile) {
      toast({
        title: "Error",
        description: "Please select a file to upload",
        variant: "destructive",
      });
      return;
    }

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", timetableFile);

      const { apiRequest } = await import("@/lib/queryClient");
      await apiRequest("POST", "/api/timetable/upload", formData, {
        headers: {
          // Let browser set Content-Type for multipart/form-data
        },
      });

      queryClient.invalidateQueries({ queryKey: ["/api/timetable"] });
      queryClient.invalidateQueries({ queryKey: ["/api/schedule"] });
      
      setIsUploadTimetableOpen(false);
      setTimetableFile(null);
      
      toast({
        title: "Success",
        description: "Timetable uploaded and analyzed successfully",
      });
    } catch (error) {
      console.error("Error uploading timetable:", error);
      toast({
        title: "Error",
        description: "Failed to upload timetable",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  const handleAssignmentUpload = async () => {
    if (!assignmentFile) {
      toast({
        title: "Error",
        description: "Please select a file to upload",
        variant: "destructive",
      });
      return;
    }

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", assignmentFile);

      const { apiRequest } = await import("@/lib/queryClient");
      await apiRequest("POST", "/api/timetable/upload-assignment", formData, {
        headers: {
          // Let browser set Content-Type for multipart/form-data
        },
      });

      queryClient.invalidateQueries({ queryKey: ["/api/assignments"] });
      
      setIsUploadAssignmentOpen(false);
      setAssignmentFile(null);
      
      toast({
        title: "Success",
        description: "Assignment analyzed and auto-scheduled to free slots",
      });
    } catch (error) {
      console.error("Error uploading assignment:", error);
      toast({
        title: "Error",
        description: "Failed to upload assignment",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  const getCurrentDaySchedule = () => {
    const today = new Date().getDay();
    return scheduleEvents.filter((event: any) => event.dayOfWeek === today);
  };

  const todaySchedule = getCurrentDaySchedule();

  return (
    <div className="min-h-screen bg-background pb-12 pt-6">
      <div className="mx-auto max-w-7xl px-4 md:px-8">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-foreground" data-testid="text-page-title">
              Timetable Manager
            </h1>
            <p className="mt-2 text-muted-foreground">
              Upload and manage your class schedule with AI-powered scheduling
            </p>
          </div>
          <div className="flex gap-3">
            <Dialog open={isUploadTimetableOpen} onOpenChange={setIsUploadTimetableOpen}>
              <DialogTrigger asChild>
                <Button className="gap-2" data-testid="button-upload-timetable">
                  <Upload className="h-4 w-4" />
                  Upload Timetable
                </Button>
              </DialogTrigger>
              <DialogContent className="bg-card border-card-border sm:max-w-[500px]">
                <DialogHeader>
                  <DialogTitle>Upload Timetable</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <p className="text-sm text-muted-foreground">
                    Upload an image of your timetable. Our AI will analyze it and automatically create your schedule.
                  </p>
                  <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-white/10 p-8">
                    <Calendar className="h-12 w-12 text-muted-foreground mb-4" />
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => setTimetableFile(e.target.files?.[0] || null)}
                      className="hidden"
                      id="timetable-upload"
                    />
                    <label
                      htmlFor="timetable-upload"
                      className="cursor-pointer text-sm text-accent hover:text-accent-hover"
                    >
                      {timetableFile ? timetableFile.name : "Click to select image"}
                    </label>
                  </div>
                  <div className="flex justify-end gap-3">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setIsUploadTimetableOpen(false)}
                      disabled={uploading}
                    >
                      Cancel
                    </Button>
                    <Button
                      onClick={handleTimetableUpload}
                      disabled={!timetableFile || uploading}
                    >
                      {uploading ? "Analyzing..." : "Upload & Analyze"}
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>

            <Dialog open={isUploadAssignmentOpen} onOpenChange={setIsUploadAssignmentOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" className="gap-2" data-testid="button-upload-assignment">
                  <FileText className="h-4 w-4" />
                  Upload Assignment
                </Button>
              </DialogTrigger>
              <DialogContent className="bg-card border-card-border sm:max-w-[500px]">
                <DialogHeader>
                  <DialogTitle>Upload Assignment Work</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <p className="text-sm text-muted-foreground">
                    Upload an image of your assignment. AI will analyze it and auto-schedule work sessions in your free slots.
                  </p>
                  <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-white/10 p-8">
                    <FileText className="h-12 w-12 text-muted-foreground mb-4" />
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => setAssignmentFile(e.target.files?.[0] || null)}
                      className="hidden"
                      id="assignment-upload"
                    />
                    <label
                      htmlFor="assignment-upload"
                      className="cursor-pointer text-sm text-accent hover:text-accent-hover"
                    >
                      {assignmentFile ? assignmentFile.name : "Click to select image"}
                    </label>
                  </div>
                  <div className="flex justify-end gap-3">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setIsUploadAssignmentOpen(false)}
                      disabled={uploading}
                    >
                      Cancel
                    </Button>
                    <Button
                      onClick={handleAssignmentUpload}
                      disabled={!assignmentFile || uploading}
                    >
                      {uploading ? "Processing..." : "Upload & Schedule"}
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Today's Schedule */}
        <GlassCard className="mb-6">
          <h2 className="text-2xl font-semibold text-foreground mb-4">
            Today's Schedule - {daysOfWeek[new Date().getDay()]}
          </h2>
          {todaySchedule.length === 0 ? (
            <div className="py-8 text-center">
              <Calendar className="mx-auto h-12 w-12 text-muted-foreground/50" />
              <p className="mt-4 text-muted-foreground">No classes scheduled for today</p>
            </div>
          ) : (
            <div className="space-y-3">
              {todaySchedule
                .sort((a: any, b: any) => a.startTime.localeCompare(b.startTime))
                .map((event: any) => (
                  <div
                    key={event.id}
                    className="flex items-center gap-4 rounded-lg border border-white/5 p-4"
                    style={{ borderLeftColor: event.color, borderLeftWidth: '4px' }}
                  >
                    <div className="flex-1">
                      <h3 className="font-medium text-foreground">{event.courseName}</h3>
                      <p className="text-sm text-muted-foreground font-mono">
                        {event.startTime} - {event.endTime}
                      </p>
                      {event.location && (
                        <p className="text-sm text-muted-foreground">{event.location}</p>
                      )}
                    </div>
                  </div>
                ))}
            </div>
          )}
        </GlassCard>

        {/* Timetable Status */}
        {timetableData && (
          <GlassCard>
            <h2 className="text-xl font-semibold text-foreground mb-4">Timetable Status</h2>
            <div className="space-y-2 text-sm text-muted-foreground">
              <p>Last uploaded: {new Date(timetableData.uploadedAt).toLocaleDateString()}</p>
              <p>Total classes: {timetableData.totalClasses || 0}</p>
              <p>Free slots available: {timetableData.freeSlots || 0}</p>
            </div>
          </GlassCard>
        )}
      </div>
    </div>
  );
}
