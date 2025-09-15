
'use client';

import React, { useState, useMemo, useRef, Fragment } from "react";
import Image from "next/image";
import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Image as ImageIcon, Video, Link2, ThumbsUp, MessageCircle, Share2, MoreHorizontal, X, Filter, Trash2, Edit } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import { useProfile } from "@/context/ProfileContext";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { useSearch } from "@/context/SearchContext";
import { TimeAgo } from "@/components/time-ago";

const initialFeedPosts = [
    {
      id: 1,
      author: {
        name: "Admin",
        role: "President",
        avatarUrl: "https://picsum.photos/seed/k/100/100",
      },
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
      content: "Don't forget our Annual General Meeting this Sunday at Community Hall, Abbasiya. Your participation is crucial for planning our future activities. See you all there!",
      mediaUrl: "https://picsum.photos/seed/m/800/450",
      mediaType: "image",
      imageHint: "community meeting",
      reactions: {
        like: [{ name: 'Member A', avatarUrl: "https://picsum.photos/seed/a/100/100" }],
        love: [{ name: 'Member C', avatarUrl: "https://picsum.photos/seed/c/100/100" }],
      },
      userReaction: null,
      comments: [
        { id: 1, author: { name: 'Member A', avatarUrl: "https://picsum.photos/seed/a/100/100" }, text: 'Looking forward to it!', reactions: { like: [{name: 'Admin', avatarUrl: "https://picsum.photos/seed/k/100/100"}, {name: 'Member B', avatarUrl: "https://picsum.photos/seed/b/100/100"}]}, userReaction: null, replies: [] },
        { id: 2, author: { name: 'Member B', avatarUrl: "https://picsum.photos/seed/b/100/100" }, text: 'Will be there.', reactions: {}, userReaction: null, replies: [] },
      ],
    },
    {
      id: 2,
      author: {
        name: "Tech Lead",
        role: "Platform Administrator",
        avatarUrl: "https://picsum.photos/seed/l/100/100",
      },
      timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
      content: "The new 'Feeds' feature is now live! We're excited to see how you use it to connect with each other. Please share your feedback in the support section.",
      reactions: {
        like: [{ name: 'Member C', avatarUrl: "https://picsum.photos/seed/c/100/100" }],
      },
      userReaction: null,
      comments: [{ id: 3, author: { name: 'Member C', avatarUrl: "https://picsum.photos/seed/c/100/100" }, text: 'This is awesome! Great work.', reactions: { like: []}, userReaction: null, replies: [] }],
    },
    {
        id: 3,
        author: {
            name: "Member Name",
            role: "Member",
            avatarUrl: "https://picsum.photos/seed/n/100/100",
        },
        timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(), // 3 days ago
        content: "Just came back from the Cultural Event & Blood Donation drive. It was so well organized and fulfilling. Proud to be part of this community!",
        mediaUrl: "https://picsum.photos/seed/p/800/450",
        mediaType: "image",
        imageHint: "cultural event",
        reactions: {},
        userReaction: null,
        comments: [],
    }
  ];

// This would be controlled by a real authentication and role system.
const currentRole = "Platform Administrator";
const isPlatformAdmin = currentRole === "Platform Administrator";

const reactionTypes = {
  like: { icon: "👍", label: "Like", color: "text-blue-500" },
  love: { icon: "❤️", label: "Love", color: "text-red-500" },
  haha: { icon: "😂", label: "Haha", color: "text-yellow-500" },
  wow: { icon: "😮", label: "Wow", color: "text-yellow-400" },
  sad: { icon: "😢", label: "Sad", color: "text-yellow-600" },
  angry: { icon: "😠", label: "Angry", color: "text-red-700" },
};
type ReactionType = keyof typeof reactionTypes;


type LikedByUser = {
    name: string;
    avatarUrl: string;
};

type UserReaction = {
  user: LikedByUser;
  reaction: ReactionType;
}

type Reply = {
    id: number;
    author: { name: string; avatarUrl: string; };
    text: string;
};

type Comment = {
    id: number;
    author: { name: string; avatarUrl: string; };
    text: string;
    reactions: Record<string, LikedByUser[]>;
    userReaction: ReactionType | null;
    replies: Reply[];
};

export default function FeedsPage() {
  const { searchQuery } = useSearch();
  const [newPostContent, setNewPostContent] = useState("");
  const [newPostMedia, setNewPostMedia] = useState({ url: '', type: '' });
  const photoInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);
  const [feedPosts, setFeedPosts] = useState(initialFeedPosts);
  const [activeCommentPostId, setActiveCommentPostId] = useState<number | null>(null);
  const [commentContent, setCommentContent] = useState("");
  const [activeReplyCommentId, setActiveReplyCommentId] = useState<number | null>(null);
  const [replyContent, setReplyContent] = useState("");
  const { toast } = useToast();
  const [sortOrder, setSortOrder] = useState<'newest' | 'oldest'>('newest');
  const { profile } = useProfile();
  const [dialogReactors, setDialogReactors] = useState<UserReaction[]>([]);
  const [isReactorsDialogOpen, setIsReactorsDialogOpen] = useState(false);
  const [activeReactionPopover, setActiveReactionPopover] = useState<string | null>(null);


  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setNewPostMedia({
          url: e.target?.result as string,
          type: file.type.startsWith('image') ? 'image' : 'video',
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const clearMedia = () => {
    setNewPostMedia({ url: '', type: ''});
    if(photoInputRef.current) photoInputRef.current.value = "";
    if(videoInputRef.current) videoInputRef.current.value = "";
  }


  const handlePost = () => {
    if (!newPostContent.trim() && !newPostMedia.url) return;

    const newPost = {
        id: feedPosts.length + 1,
        author: {
            name: profile.fullName,
            role: "Member",
            avatarUrl: profile.avatarUrl,
        },
        timestamp: new Date().toISOString(),
        content: newPostContent,
        mediaUrl: newPostMedia.url,
        mediaType: newPostMedia.type,
        imageHint: 'user uploaded content',
        reactions: {},
        userReaction: null,
        comments: [],
    };

    setFeedPosts([newPost, ...feedPosts]);
    setNewPostContent("");
    clearMedia();
  };

  const handleDeletePost = (postId: number) => {
    setFeedPosts(feedPosts.filter(post => post.id !== postId));
    toast({
        title: "Post Deleted",
        description: "The post has been successfully removed from the feed.",
    });
  }

  const handleReaction = (postId: number, reaction: ReactionType) => {
    setFeedPosts(
      feedPosts.map((post) => {
        if (post.id === postId) {
          const newReactions = { ...post.reactions };
          const currentUser = { name: profile.fullName, avatarUrl: profile.avatarUrl };
  
          // Remove previous reaction from the user
          if (post.userReaction) {
            newReactions[post.userReaction] = (newReactions[post.userReaction] || []).filter(
              (user) => user.name !== currentUser.name
            );
            if (newReactions[post.userReaction]?.length === 0) {
                delete newReactions[post.userReaction];
            }
          }
  
          // If the same reaction is clicked again, it's an "un-react"
          if (post.userReaction === reaction) {
            return { ...post, reactions: newReactions, userReaction: null };
          }
  
          // Add new reaction
          newReactions[reaction] = [...(newReactions[reaction] || []), currentUser];
          
          return { ...post, reactions: newReactions, userReaction: reaction };
        }
        return post;
      })
    );
    setActiveReactionPopover(null);
  };

  const handleCommentReaction = (postId: number, commentId: number, reaction: ReactionType) => {
    setFeedPosts(feedPosts.map(post => {
        if (post.id === postId) {
            return {
                ...post,
                comments: post.comments.map(comment => {
                    if (comment.id === commentId) {
                        const newReactions = { ...comment.reactions };
                        const currentUser = { name: profile.fullName, avatarUrl: profile.avatarUrl };

                        if (comment.userReaction) {
                            newReactions[comment.userReaction] = (newReactions[comment.userReaction] || []).filter(
                                (user) => user.name !== currentUser.name
                            );
                             if (newReactions[comment.userReaction]?.length === 0) {
                                delete newReactions[comment.userReaction];
                            }
                        }

                        if (comment.userReaction === reaction) {
                           return { ...comment, reactions: newReactions, userReaction: null };
                        }

                        newReactions[reaction] = [...(newReactions[reaction] || []), currentUser];
                        return { ...comment, reactions: newReactions, userReaction: reaction };
                    }
                    return comment;
                })
            };
        }
        return post;
    }));
    setActiveReactionPopover(null);
  };
  
  const handleCommentToggle = (postId: number) => {
    if (activeCommentPostId === postId) {
        setActiveCommentPostId(null);
    } else {
        setActiveCommentPostId(postId);
    }
    setCommentContent(""); // Reset comment input when toggling
    setActiveReplyCommentId(null); // Close reply input
  };
  
  const handleReplyToggle = (commentId: number) => {
    if (activeReplyCommentId === commentId) {
        setActiveReplyCommentId(null);
    } else {
        setActiveReplyCommentId(commentId);
    }
    setReplyContent("");
  };

  const handleCommentSubmit = (postId: number) => {
    if (!commentContent.trim()) return;

    const newComment: Comment = {
        id: Date.now(), // Use timestamp for unique ID
        author: { name: profile.fullName, avatarUrl: profile.avatarUrl },
        text: commentContent,
        reactions: {},
        userReaction: null,
        replies: [],
    };

    setFeedPosts(feedPosts.map(post => 
      post.id === postId ? { ...post, comments: [...post.comments, newComment] } : post
    ));

    setCommentContent(""); // Clear input after submitting
  };

  const handleReplySubmit = (postId: number, commentId: number) => {
    if (!replyContent.trim()) return;

    const newReply: Reply = {
        id: Date.now(),
        author: { name: profile.fullName, avatarUrl: profile.avatarUrl },
        text: replyContent,
    };

    setFeedPosts(feedPosts.map(post => {
        if (post.id === postId) {
            return {
                ...post,
                comments: post.comments.map(comment => {
                    if (comment.id === commentId) {
                        return { ...comment, replies: [...(comment.replies || []), newReply] };
                    }
                    return comment;
                })
            };
        }
        return post;
    }));
    
    setReplyContent("");
    setActiveReplyCommentId(null);
  };


  const handleShare = async (postId: number) => {
    const postToShare = feedPosts.find(p => p.id === postId);
    if (!postToShare) return;
  
    const shareData = {
      title: `Post by ${postToShare.author.name}`,
      text: postToShare.content,
      url: window.location.href,
    };
  
    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (error) {
        // If the user cancels the share dialog, do nothing.
        if ((error as DOMException).name === 'AbortError') {
          return;
        }
        // For other errors, try to copy to clipboard as a fallback.
        try {
          if (navigator.clipboard && (await navigator.permissions.query({ name: 'clipboard-write' as PermissionName })).state !== 'denied') {
            await navigator.clipboard.writeText(shareData.url);
            toast({
              title: "Link Copied!",
              description: "Sharing isn't available, so we copied the link for you.",
            });
          } else {
             toast({
              variant: "destructive",
              title: "Sharing Failed",
              description: "Could not share or copy the link at this time.",
            });
          }
        } catch (copyError) {
          console.error("Copying to clipboard failed:", copyError);
          toast({
            variant: "destructive",
            title: "Sharing Failed",
            description: "Could not share or copy the link at this time.",
          });
        }
      }
    } else {
      // Fallback for browsers that don't support navigator.share
       try {
          if (navigator.clipboard && (await navigator.permissions.query({ name: 'clipboard-write' as PermissionName })).state !== 'denied') {
            await navigator.clipboard.writeText(shareData.url);
            toast({
              title: "Link Copied!",
              description: "The link to the post has been copied to your clipboard.",
            });
          } else {
             toast({
              variant: "destructive",
              title: "Sharing Failed",
              description: "Could not share or copy the link at this time.",
            });
          }
        } catch (copyError) {
          console.error("Copying to clipboard failed:", copyError);
          toast({
            variant: "destructive",
            title: "Sharing Failed",
            description: "Could not share or copy the link at this time.",
          });
        }
    }
  };
  
  const showComingSoonToast = () => {
    toast({
        title: "Feature Coming Soon!",
        description: "This functionality is not yet implemented.",
    });
  };

  const handleSort = (order: 'newest' | 'oldest') => {
    setSortOrder(order);
    toast({
      title: "Posts Sorted",
      description: `Posts have been sorted from ${order} to ${order === 'newest' ? 'oldest' : 'newest'}.`,
    });
  };

  const openReactorsDialog = (reactions: Record<string, LikedByUser[]>) => {
    const reactors: UserReaction[] = Object.entries(reactions).flatMap(([reaction, users]) => 
      users.map(user => ({ user, reaction: reaction as ReactionType }))
    );
    setDialogReactors(reactors);
    setIsReactorsDialogOpen(true);
  };
  
  const filteredFeedPosts = useMemo(() => {
    let postsToFilter = feedPosts;
    if (searchQuery) {
        postsToFilter = feedPosts.filter(post =>
        post.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.author.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    return [...postsToFilter].sort((a, b) => {
        const dateA = new Date(a.timestamp).getTime();
        const dateB = new Date(b.timestamp).getTime();
        return sortOrder === 'newest' ? dateB - dateA : dateA - dateB;
    });

  }, [searchQuery, feedPosts, sortOrder]);

  return (
    <>
      <PageHeader
        title="Feeds"
        description="Share updates, photos, and connect with the community."
      >
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="outline">
                    <Filter className="mr-2" />
                    Filter
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
                <DropdownMenuItem onSelect={() => handleSort('newest')}>
                    Newest to oldest
                </DropdownMenuItem>
                <DropdownMenuItem onSelect={() => handleSort('oldest')}>
                    Oldest to newest
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
      </PageHeader>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
            {isPlatformAdmin && (
              <Card>
                  <CardHeader className="p-4 pb-0">
                      <div className="flex items-start gap-4">
                          <Avatar>
                              <AvatarImage src={profile.avatarUrl} data-ai-hint="person avatar" />
                              <AvatarFallback>{profile.fullName.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <div className="w-full">
                              <Textarea 
                                  placeholder="What's on your mind?" 
                                  className="w-full border-0 focus-visible:ring-0 p-0 shadow-none text-base"
                                  value={newPostContent}
                                  onChange={(e) => setNewPostContent(e.target.value)}
                                />
                          </div>
                      </div>
                  </CardHeader>
                  <CardContent className="p-4">
                      {newPostMedia.url && (
                          <div className="relative group">
                              {newPostMedia.type === 'image' ? (
                                  <Image src={newPostMedia.url} alt="Preview" width={400} height={225} className="rounded-md object-cover max-h-60 w-auto" />
                              ) : (
                                  <div className="text-sm text-muted-foreground p-2 bg-secondary rounded-md">Video selected.</div>
                              )}
                              <Button variant="destructive" size="icon" className="absolute top-2 right-2 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity" onClick={clearMedia}>
                                  <X className="h-4 w-4" />
                              </Button>
                          </div>
                      )}
                  </CardContent>
                  <CardFooter className="flex justify-between items-center p-4 pt-0">
                      <div className="flex gap-2">
                          <input type="file" ref={photoInputRef} onChange={handleFileChange} accept="image/*" className="hidden" />
                          <input type="file" ref={videoInputRef} onChange={handleFileChange} accept="video/*" className="hidden" />
                          <Button variant="ghost" size="icon" onClick={() => photoInputRef.current?.click()}><ImageIcon className="text-muted-foreground"/></Button>
                          <Button variant="ghost" size="icon" onClick={() => videoInputRef.current?.click()}><Video className="text-muted-foreground"/></Button>
                          <Button variant="ghost" size="icon" onClick={showComingSoonToast}><Link2 className="text-muted-foreground"/></Button>
                      </div>
                      <Button onClick={handlePost}>Post</Button>
                  </CardFooter>
              </Card>
            )}

            {filteredFeedPosts.map((post) => {
                const canModify = isPlatformAdmin || post.author.name === profile.fullName;
                const totalReactions = Object.values(post.reactions).flat().length;
                const topReactions = Object.entries(post.reactions)
                  .sort(([, a], [, b]) => b.length - a.length)
                  .slice(0, 3)
                  .map(([type]) => type as ReactionType);

                return (
                    <Card key={post.id}>
                        <CardHeader className="p-4">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <Avatar>
                                        <AvatarImage src={post.author.avatarUrl} data-ai-hint="person face" />
                                        <AvatarFallback>{post.author.name.charAt(0)}</AvatarFallback>
                                    </Avatar>
                                    <div>
                                        <p className="font-semibold">{post.author.name}</p>
                                        <p className="text-xs text-muted-foreground">{post.author.role} &middot; <TimeAgo dateString={post.timestamp} /></p>
                                    </div>
                                </div>
                                {canModify && (
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button variant="ghost" size="icon">
                                                <MoreHorizontal className="h-5 w-5"/>
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent>
                                            <DropdownMenuItem onClick={showComingSoonToast}><Edit className="mr-2 h-4 w-4" /> Edit</DropdownMenuItem>
                                            <DropdownMenuSeparator />
                                            <DropdownMenuItem onClick={() => handleDeletePost(post.id)} className="text-destructive focus:text-destructive focus:bg-destructive/10">
                                                <Trash2 className="mr-2 h-4 w-4" /> Delete
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                )}
                            </div>
                        </CardHeader>
                        <CardContent className="px-4 pb-2">
                            <p className="text-sm text-foreground/90">{post.content}</p>
                        </CardContent>
                        {post.mediaUrl && (
                             <CardContent className="p-0">
                                {post.mediaType === 'image' ? (
                                    <Image
                                        src={post.mediaUrl}
                                        alt="Feed post image"
                                        width={800}
                                        height={450}
                                        data-ai-hint={post.imageHint}
                                        className="w-full aspect-video object-cover"
                                    />
                                ) : (
                                    <video
                                        src={post.mediaUrl}
                                        controls
                                        className="w-full aspect-video"
                                    />
                                )}
                            </CardContent>
                        )}
                        <CardFooter className="p-2 pb-1 flex flex-col items-start">
                             <div className="flex justify-between items-center text-xs text-muted-foreground w-full px-2 py-1">
                                <button className="hover:underline flex items-center gap-1" onClick={() => openReactorsDialog(post.reactions)}>
                                    {totalReactions > 0 && (
                                        <>
                                            <div className="flex items-center">
                                                {topReactions.map((type) => {
                                                     const emoji = reactionTypes[type].icon;
                                                     return <span key={type} className="text-sm -ml-1 first:ml-0">{emoji}</span>
                                                })}
                                            </div>
                                            <span>{totalReactions}</span>
                                        </>
                                    )}
                                </button>
                                <span>{post.comments.length} Comments</span>
                            </div>
                            <Separator />
                            <div className="w-full grid grid-cols-3">
                               <Popover open={activeReactionPopover === `post-${post.id}`} onOpenChange={(isOpen) => setActiveReactionPopover(isOpen ? `post-${post.id}` : null)}>
                                    <PopoverTrigger asChild>
                                        <Button variant="ghost" className={cn("text-muted-foreground font-semibold rounded-none flex items-center gap-2", post.userReaction && reactionTypes[post.userReaction].color)}>
                                            {post.userReaction ? (
                                                <Fragment>
                                                    <span className="text-lg">{reactionTypes[post.userReaction].icon}</span>
                                                    {reactionTypes[post.userReaction].label}
                                                </Fragment>
                                            ) : (
                                                <Fragment>
                                                    <ThumbsUp className="h-4 w-4"/> Like
                                                </Fragment>
                                            )}
                                        </Button>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-auto p-1">
                                        <div className="flex gap-1">
                                            {Object.keys(reactionTypes).map((type) => {
                                                const reaction = reactionTypes[type as ReactionType];
                                                return (
                                                    <Button key={type} variant="ghost" size="icon" className="rounded-full text-2xl" onClick={() => handleReaction(post.id, type as ReactionType)}>
                                                        {reaction.icon}
                                                    </Button>
                                                )
                                            })}
                                        </div>
                                    </PopoverContent>
                                </Popover>
                               <Button variant="ghost" className="text-muted-foreground font-semibold rounded-none" onClick={() => handleCommentToggle(post.id)}>
                                   <MessageCircle className="mr-2"/> Comment
                               </Button>
                               <Button variant="ghost" className="text-muted-foreground font-semibold rounded-none" onClick={() => handleShare(post.id)}>
                                   <Share2 className="mr-2"/> Share
                               </Button>
                            </div>
                        </CardFooter>
                        {activeCommentPostId === post.id && (
                            <div className="p-4 border-t">
                                <div className="space-y-4">
                                    {post.comments.map(comment => {
                                        const totalCommentReactions = Object.values(comment.reactions || {}).flat().length;
                                        return (
                                        <div key={comment.id}>
                                            <div className="flex items-start gap-3">
                                                <Avatar className="h-8 w-8">
                                                    <AvatarImage src={comment.author.avatarUrl} data-ai-hint="person face" />
                                                    <AvatarFallback>{comment.author.name.charAt(0)}</AvatarFallback>
                                                </Avatar>
                                                <div className="bg-secondary rounded-lg p-2 text-sm w-full">
                                                    <p className="font-semibold">{comment.author.name}</p>
                                                    <p>{comment.text}</p>
                                                    <div className="flex items-center gap-4 text-xs text-muted-foreground mt-2">
                                                        <Popover open={activeReactionPopover === `comment-${comment.id}`} onOpenChange={(isOpen) => setActiveReactionPopover(isOpen ? `comment-${comment.id}` : null)}>
                                                            <PopoverTrigger asChild>
                                                                <button className={cn("hover:underline", comment.userReaction && reactionTypes[comment.userReaction].color)}>
                                                                    {comment.userReaction ? reactionTypes[comment.userReaction].label : 'Like'}
                                                                </button>
                                                            </PopoverTrigger>
                                                            <PopoverContent className="w-auto p-1">
                                                                <div className="flex gap-1">
                                                                    {Object.keys(reactionTypes).map((type) => {
                                                                        const reaction = reactionTypes[type as ReactionType];
                                                                        return (
                                                                            <Button key={type} variant="ghost" size="icon" className="rounded-full text-2xl" onClick={() => handleCommentReaction(post.id, comment.id, type as ReactionType)}>
                                                                                {reaction.icon}
                                                                            </Button>
                                                                        )
                                                                    })}
                                                                </div>
                                                            </PopoverContent>
                                                        </Popover>
                                                        <button className="hover:underline" onClick={() => handleReplyToggle(comment.id)}>Reply</button>
                                                        {totalCommentReactions > 0 && (
                                                          <button className="hover:underline" onClick={() => openReactorsDialog(comment.reactions || {})}>
                                                            {totalCommentReactions} {totalCommentReactions === 1 ? 'Like' : 'Likes'}
                                                          </button>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                            
                                            {/* Replies Section */}
                                            <div className="pl-11 mt-3 space-y-3">
                                                {(comment.replies || []).map(reply => (
                                                    <div key={reply.id} className="flex items-start gap-3">
                                                        <Avatar className="h-6 w-6">
                                                            <AvatarImage src={reply.author.avatarUrl} data-ai-hint="person face" />
                                                            <AvatarFallback>{reply.author.name.charAt(0)}</AvatarFallback>
                                                        </Avatar>
                                                         <div className="bg-background rounded-lg p-2 text-sm w-full">
                                                            <p className="font-semibold">{reply.author.name}</p>
                                                            <p>{reply.text}</p>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>

                                            {/* Reply Input */}
                                            {activeReplyCommentId === comment.id && (
                                                <div className="pl-11 mt-3 flex items-center gap-2">
                                                    <Avatar className="h-6 w-6">
                                                        <AvatarImage src={profile.avatarUrl} data-ai-hint="person avatar" />
                                                        <AvatarFallback>{profile.fullName.charAt(0)}</AvatarFallback>
                                                    </Avatar>
                                                    <Input
                                                        placeholder={`Reply to ${comment.author.name}...`}
                                                        value={replyContent}
                                                        onChange={(e) => setReplyContent(e.target.value)}
                                                        onKeyDown={(e) => {
                                                            if (e.key === 'Enter' && !e.shiftKey) {
                                                                e.preventDefault();
                                                                handleReplySubmit(post.id, comment.id);
                                                            }
                                                        }}
                                                    />
                                                    <Button size="sm" onClick={() => handleReplySubmit(post.id, comment.id)}>Reply</Button>
                                                </div>
                                            )}
                                        </div>
                                    )})}
                                </div>
                                 <div className="mt-4 flex items-center gap-2">
                                    <Avatar className="h-8 w-8">
                                         <AvatarImage src={profile.avatarUrl} data-ai-hint="person avatar" />
                                         <AvatarFallback>{profile.fullName.charAt(0)}</AvatarFallback>
                                    </Avatar>
                                    <Input 
                                        placeholder="Write a comment..." 
                                        value={commentContent}
                                        onChange={(e) => setCommentContent(e.target.value)}
                                        onKeyDown={(e) => {
                                            if (e.key === 'Enter' && !e.shiftKey) {
                                                e.preventDefault();
                                                handleCommentSubmit(post.id);
                                            }
                                        }}
                                    />
                                    <Button size="sm" onClick={() => handleCommentSubmit(post.id)}>Post</Button>
                                </div>
                            </div>
                        )}
                    </Card>
                )
            })}
        </div>

        <div className="space-y-6 lg:col-span-1">
            <Card>
                <CardHeader>
                    <CardTitle>Trending Topics</CardTitle>
                </CardHeader>
                <CardContent>
                    <ul className="space-y-2 text-sm text-primary">
                        <li>#AGM2024</li>
                        <li>#CommunityUnity</li>
                        <li>#NewFeatures</li>
                        <li>#DonationDrive</li>
                    </ul>
                </CardContent>
            </Card>
        </div>
      </div>
      <Dialog open={isReactorsDialogOpen} onOpenChange={setIsReactorsDialogOpen}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Reactions</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 py-4 max-h-96 overflow-y-auto">
                    {dialogReactors.length > 0 ? (
                        dialogReactors.map(({ user, reaction }, index) => {
                             const emoji = reactionTypes[reaction]?.icon || '👍';
                            return (
                                <div key={index} className="flex items-center justify-between">
                                    <div className="flex items-center gap-4">
                                        <Avatar>
                                            <AvatarImage src={user.avatarUrl} data-ai-hint="person face" />
                                            <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                                        </Avatar>
                                        <p className="font-semibold">{user.name}</p>
                                    </div>
                                    <span className="text-2xl">{emoji}</span>
                                </div>
                            )
                        })
                    ) : (
                        <p className="text-muted-foreground text-center">No one has reacted yet.</p>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    </>
  );
}

    