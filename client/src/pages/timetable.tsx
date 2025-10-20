
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
    <div className="min-h-screen bg-background pb-12 pt-6 relative overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-accent/5 rounded-full blur-3xl animate-pulse-slow"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent/5 rounded-full blur-3xl animate-pulse-slow-delay"></div>
      </div>

      <div className="mx-auto max-w-7xl px-4 md:px-8 relative z-10">
        <div className="mb-8 flex items-center justify-between animate-fade-in-up">
          <div>
            <h1 className="text-5xl font-bold text-foreground mb-2" data-testid="text-page-title">
              Timetable Manager
            </h1>
            <p className="text-lg text-muted-foreground">
              Upload and manage your class schedule with <span className="text-accent font-medium">AI-powered scheduling</span> ✨
            </p>
          </div>
          <div className="flex gap-3 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
            <Dialog open={isUploadTimetableOpen} onOpenChange={setIsUploadTimetableOpen}>
              <DialogTrigger asChild>
                <Button className="gap-2 shadow-lg shadow-accent/20 hover:shadow-accent/40 transition-all duration-300 hover:scale-105" data-testid="button-upload-timetable">
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
        <GlassCard className="mb-6 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 bg-accent/10 rounded-2xl border border-accent/20">
              <Calendar className="h-6 w-6 text-accent" />
            </div>
            <div>
              <h2 className="text-2xl font-semibold text-foreground">
                Today's Schedule
              </h2>
              <p className="text-sm text-accent">{daysOfWeek[new Date().getDay()]}</p>
            </div>
          </div>
          {todaySchedule.length === 0 ? (
            <div className="py-12 text-center">
              <div className="inline-flex p-6 bg-accent/5 rounded-full mb-4">
                <Calendar className="h-16 w-16 text-accent/50" />
              </div>
              <p className="text-lg text-muted-foreground">No classes scheduled for today</p>
              <p className="text-sm text-muted-foreground mt-2">Enjoy your free time! 🎉</p>
            </div>
          ) : (
            <div className="space-y-3">
              {todaySchedule
                .sort((a: any, b: any) => a.startTime.localeCompare(b.startTime))
                .map((event: any, index: number) => (
                  <div
                    key={event.id}
                    className="group flex items-center gap-4 rounded-xl border border-accent/10 p-5 bg-gradient-to-r from-accent/5 to-transparent hover:from-accent/10 hover:border-accent/30 transition-all duration-300 hover:scale-[1.02] animate-fade-in-up"
                    style={{ 
                      borderLeftColor: event.color || 'hsl(var(--accent))', 
                      borderLeftWidth: '4px',
                      animationDelay: `${0.3 + index * 0.1}s`
                    }}
                  >
                    <div className="flex-1">
                      <h3 className="font-semibold text-foreground text-lg mb-1 group-hover:text-accent transition-colors duration-300">{event.courseName}</h3>
                      <p className="text-sm text-accent font-mono mb-1">
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
          <GlassCard className="animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
            <h2 className="text-xl font-semibold text-foreground mb-4 flex items-center gap-2">
              <div className="w-2 h-2 bg-accent rounded-full animate-pulse"></div>
              Timetable Status
            </h2>
            <div className="space-y-3">
              <div className="flex justify-between items-center p-3 bg-accent/5 rounded-lg">
                <span className="text-sm text-muted-foreground">Last uploaded</span>
                <span className="text-sm font-medium text-accent">{new Date(timetableData.uploadedAt).toLocaleDateString()}</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-accent/5 rounded-lg">
                <span className="text-sm text-muted-foreground">Total classes</span>
                <span className="text-sm font-medium text-accent">{timetableData.totalClasses || 0}</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-accent/5 rounded-lg">
                <span className="text-sm text-muted-foreground">Free slots available</span>
                <span className="text-sm font-medium text-accent">{timetableData.freeSlots || 0}</span>
              </div>
            </div>
          </GlassCard>
        )}

        {/* Footer Credit */}
        <div className="text-center mt-12 animate-fade-in" style={{ animationDelay: '0.5s' }}>
          <p className="text-sm text-muted-foreground flex items-center justify-center gap-1">
            Crafted with <span className="text-red-500 animate-pulse">❤️</span> by Surya
          </p>
        </div>
      </div>
    </div>
  );
}
