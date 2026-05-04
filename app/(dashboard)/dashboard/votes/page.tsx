"use client";

import { useState } from "react";
import { 
  useGetDecisionsQuery, 
  useCreateDecisionMutation,
  useCastVoteMutation 
} from "@/redux/features/vote/voteApi";
import { AFPageHeader } from "@/components/shared/AFPageHeader";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Vote, 
  Plus, 
  Clock, 
  CheckCircle2, 
  XCircle,
  BarChart3,
  CalendarDays
} from "lucide-react";
import { AFModal } from "@/components/shared/AFModal";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { useSelector } from "react-redux";
import { selectCurrentUser } from "@/redux/features/auth/authSlice";
import { format } from "date-fns";

export default function VotingPage() {
  const user = useSelector(selectCurrentUser);
  const { data: decisions, isLoading } = useGetDecisionsQuery({});
  const [createDecision, { isLoading: isCreating }] = useCreateDecisionMutation();
  const [castVote] = useCastVoteMutation();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newDecision, setNewDecision] = useState({
    title: "",
    description: "",
    options: "Yes,No",
    deadline: "",
  });

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createDecision({
        ...newDecision,
        options: newDecision.options.split(",").map(o => o.trim()),
        deadline: new Date(newDecision.deadline).toISOString(),
      }).unwrap();
      toast.success("Decision poll created");
      setIsModalOpen(false);
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to create poll");
    }
  };

  const handleVote = async (id: string, option: string) => {
    try {
      await castVote({ id, option }).unwrap();
      toast.success("Vote recorded");
    } catch (err: any) {
      toast.error(err?.data?.message || "Voting failed");
    }
  };

  return (
    <div className="space-y-8 pb-12">
      <AFPageHeader
        title="Foundation Voting"
        description="Collective decision making for foundation matters"
        action={
          (user?.role === 'SUPER_ADMIN' || user?.role === 'ADMIN') && (
            <Button onClick={() => setIsModalOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              New Poll
            </Button>
          )
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {isLoading ? (
          <div className="lg:col-span-2 text-center py-20 font-bold opacity-50">Loading polls...</div>
        ) : decisions?.length > 0 ? (
          decisions.map((decision: any) => {
            const totalVotes = decision.votes?.length || 0;
            const isClosed = decision.status === 'CLOSED' || new Date() > new Date(decision.deadline);
            const userVote = decision.votes?.find((v: any) => v.userId?._id === user?._id || v.userId === user?._id);

            return (
              <Card key={decision._id} className={`overflow-hidden border-gray-100 shadow-sm hover:shadow-md transition-all ${isClosed ? 'bg-gray-50/50' : 'bg-white'}`}>
                <CardHeader className="p-6">
                  <div className="flex justify-between items-start mb-2">
                    <Badge variant={isClosed ? "secondary" : "default"} className={isClosed ? "" : "bg-emerald-500"}>
                      {isClosed ? "Closed" : "Active Pool"}
                    </Badge>
                    <div className="flex items-center text-[10px] font-black uppercase text-muted-foreground gap-1">
                      <Clock size={12} />
                      {format(new Date(decision.deadline), "MMM d, h:mm a")}
                    </div>
                  </div>
                  <CardTitle className="text-xl font-black text-gray-900">{decision.title}</CardTitle>
                  <CardDescription className="text-sm font-medium leading-relaxed mt-2">
                    {decision.description}
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-6 pt-0 space-y-6">
                  <div className="space-y-3">
                    {decision.options.map((opt: string) => {
                      const optVotes = decision.votes?.filter((v: any) => v.option === opt).length || 0;
                      const percentage = totalVotes > 0 ? (optVotes / totalVotes) * 100 : 0;
                      const isSelected = userVote?.option === opt;

                      return (
                        <div key={opt} className="space-y-1.5">
                          <div className="flex justify-between items-center text-[11px] font-bold">
                            <span className="flex items-center gap-2">
                              {opt} {isSelected && <CheckCircle2 size={12} className="text-emerald-500" />}
                            </span>
                            <span className="text-muted-foreground">{optVotes} votes ({Math.round(percentage)}%)</span>
                          </div>
                          {isClosed ? (
                            <Progress value={percentage} className="h-2 bg-gray-100" />
                          ) : (
                            <div 
                              onClick={() => handleVote(decision._id, opt)}
                              className={`group cursor-pointer relative h-10 w-full rounded-xl overflow-hidden border transition-all ${isSelected ? 'border-primary bg-primary/5' : 'border-gray-100 hover:border-primary/50'}`}
                            >
                              <div 
                                className={`absolute inset-0 transition-all duration-1000 ${isSelected ? 'bg-primary/10' : 'bg-gray-50 group-hover:bg-primary/5'}`} 
                                style={{ width: `${percentage}%` }} 
                              />
                              <div className="absolute inset-0 flex items-center px-4 font-black text-xs uppercase tracking-widest text-gray-700 group-hover:text-primary transition-colors">
                                {opt}
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-gray-50 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                    <span className="flex items-center gap-1.5">
                      <BarChart3 size={14} className="text-primary" />
                      Total {totalVotes} participants
                    </span>
                    <span>Created by {decision.createdBy?.name || 'Admin'}</span>
                  </div>
                </CardContent>
              </Card>
            );
          })
        ) : (
          <div className="lg:col-span-2 text-center py-20 bg-white border border-dashed rounded-3xl">
            <Vote className="h-12 w-12 text-gray-200 mx-auto mb-4" />
            <h3 className="text-lg font-bold text-gray-500">No active polls found</h3>
            <p className="text-sm text-gray-400 mt-1">Foundational decisions will appear here.</p>
          </div>
        )}
      </div>

      <AFModal
        isOpen={isModalOpen}
        onOpenChange={setIsModalOpen}
        title="Create Final Decision Poll"
      >
        <form onSubmit={handleCreate} className="space-y-4">
          <div className="space-y-2">
            <label className="text-xs font-black uppercase tracking-widest text-muted-foreground">Title</label>
            <Input 
              required
              placeholder="e.g. Purchase new office land"
              value={newDecision.title}
              onChange={(e) => setNewDecision({...newDecision, title: e.target.value})}
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-black uppercase tracking-widest text-muted-foreground">Full Description</label>
            <Textarea 
              required
              placeholder="Explain the necessity of this decision..."
              value={newDecision.description}
              onChange={(e) => setNewDecision({...newDecision, description: e.target.value})}
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-black uppercase tracking-widest text-muted-foreground">Options (Comma separated)</label>
            <Input 
              required
              placeholder="Yes, No, Postpone"
              value={newDecision.options}
              onChange={(e) => setNewDecision({...newDecision, options: e.target.value})}
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-black uppercase tracking-widest text-muted-foreground">Deadline Date & Time</label>
            <Input 
              required
              type="datetime-local"
              value={newDecision.deadline}
              onChange={(e) => setNewDecision({...newDecision, deadline: e.target.value})}
            />
          </div>
          <Button type="submit" className="w-full h-12 mt-4 font-black uppercase tracking-widest" disabled={isCreating}>
            Launch Poll
          </Button>
        </form>
      </AFModal>
    </div>
  );
}
