'use client'
import { useState } from "react";

export default function Home() {
  const [selectedEmail, setSelectedEmail] = useState(0);
  
  // Sample email data
  const emails = [
    {
      id: 1,
      sender: "William Smith",
      subject: "Meeting Tomorrow",
      time: "Oct 22, 2023, 9:00:00 AM",
      reply: "To: williamsmith@example.com",
      content: "Hi, let's have a meeting tomorrow to discuss the project. I've been reviewing the project details and have some ideas I'd like to share. It's crucial that we align on our next steps to ensure the project's success.",
      tags: ["meeting", "work", "important"],
      read: false
    },
    {
      id: 2,
      sender: "Alice Smith",
      subject: "Re: Project Update",
      time: "about 2 years ago",
      content: "Thank you for the project update. It looks great! I've gone through the report, and the progress is impressive. The team has done a fantastic job.",
      tags: ["work", "important"],
      read: true
    },
    {
      id: 3,
      sender: "Bob Johnson",
      subject: "Weekend Plans",
      time: "over 2 years ago",
      content: "Any plans for the weekend? I was thinking of going hiking in the nearby mountains. It's been a while since we had some outdoor fun. If you're interested, let me know!",
      tags: ["personal"],
      read: true
    },
    {
      id: 4,
      sender: "Emily Davis",
      subject: "Re: Question about Budget",
      time: "over 2 years ago",
      content: "I have a question about the budget for the upcoming project. It seems like there's a discrepancy in the allocation of resources. I've reviewed the documents and found some inconsistencies.",
      tags: ["work", "budget"],
      read: true
    },
    {
      id: 5,
      sender: "Michael Wilson",
      subject: "Important Announcement",
      time: "over 2 years ago",
      content: "I have an important announcement to make during our team meeting. It pertains to a strategic shift in our approach to the upcoming project.",
      tags: ["work", "important"],
      read: true
    }
  ];

  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar */}
      <div className="w-64 bg-sidebar text-sidebar-foreground border-r border-sidebar-border">
        <div className="p-4">
          <div className="flex items-center space-x-2 mb-6">
            <select className="w-full p-2 bg-sidebar text-sidebar-foreground border border-sidebar-border rounded">
              <option>Alicia Koch</option>
            </select>
          </div>
          
          {/* Sidebar menu */}
          <nav className="space-y-1">
            <div className="flex items-center justify-between p-2 bg-sidebar-primary text-sidebar-primary-foreground rounded">
              <span>Inbox</span>
              <span className="bg-white text-sidebar-primary px-2 rounded-full text-xs">128</span>
            </div>
            <div className="flex items-center justify-between p-2">
              <span>Drafts</span>
              <span className="text-xs">9</span>
            </div>
            <div className="flex items-center justify-between p-2">
              <span>Sent</span>
              <span className="text-xs"></span>
            </div>
            <div className="flex items-center justify-between p-2">
              <span>Junk</span>
              <span className="text-xs">23</span>
            </div>
            <div className="flex items-center justify-between p-2">
              <span>Trash</span>
              <span className="text-xs"></span>
            </div>
            <div className="flex items-center justify-between p-2">
              <span>Archive</span>
              <span className="text-xs"></span>
            </div>
          </nav>
          
          <div className="mt-6 pt-6 border-t border-sidebar-border">
            <nav className="space-y-1">
              <div className="flex items-center justify-between p-2">
                <span>Social</span>
                <span className="text-xs">672</span>
              </div>
              <div className="flex items-center justify-between p-2">
                <span>Updates</span>
                <span className="text-xs">342</span>
              </div>
              <div className="flex items-center justify-between p-2">
                <span>Forums</span>
                <span className="text-xs">128</span>
              </div>
              <div className="flex items-center justify-between p-2">
                <span>Shopping</span>
                <span className="text-xs">8</span>
              </div>
              <div className="flex items-center justify-between p-2">
                <span>Promotions</span>
                <span className="text-xs">21</span>
              </div>
            </nav>
          </div>
        </div>
      </div>
      
      {/* Main content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="border-b border-border p-4">
          <div className="flex justify-between items-center">
            <h1 className="text-xl font-medium">Inbox</h1>
            <div className="flex space-x-2">
              <button className="px-3 py-1 bg-muted text-muted-foreground rounded">All mail</button>
              <button className="px-3 py-1 bg-primary text-primary-foreground rounded">Unread</button>
            </div>
          </div>
        </header>
        
        {/* Email list and detail view */}
        <div className="flex-1 flex overflow-hidden">
          {/* Email list */}
          <div className="w-1/2 border-r border-border overflow-y-auto">
            <div className="p-4">
              <div className="relative mb-4">
                <input
                  type="text"
                  placeholder="Search"
                  className="w-full p-2 pl-8 border border-input rounded bg-background"
                />
                <svg
                  className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>
              
              {/* Email items */}
              {emails.map((email, index) => (
                <div
                  key={email.id}
                  className={`p-4 border-b border-border cursor-pointer ${
                    selectedEmail === index ? "bg-muted" : ""
                  }`}
                  onClick={() => setSelectedEmail(index)}
                >
                  <div className="flex justify-between mb-1">
                    <h3 className="font-medium">{email.sender}</h3>
                    <span className="text-xs text-muted-foreground">{email.time}</span>
                  </div>
                  <h4 className="font-medium mb-1">{email.subject}</h4>
                  <p className="text-sm text-muted-foreground truncate">{email.content}</p>
                  
                  {email.tags && (
                    <div className="flex mt-2 space-x-2">
                      {email.tags.map((tag) => (
                        <span
                          key={tag}
                          className={`px-2 py-0.5 text-xs rounded ${
                            tag === "work" ? "bg-secondary text-secondary-foreground" :
                            tag === "important" ? "bg-primary text-primary-foreground" :
                            tag === "personal" ? "bg-accent text-accent-foreground" :
                            tag === "meeting" ? "bg-muted text-muted-foreground" :
                            tag === "budget" ? "bg-accent text-accent-foreground" :
                            "bg-muted text-muted-foreground"
                          }`}
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
          
          {/* Email detail */}
          <div className="w-1/2 overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center mb-6">
                <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center text-secondary-foreground font-medium mr-4">
                  {emails[selectedEmail].sender.split(" ").map(name => name[0]).join("")}
                </div>
                <div>
                  <h2 className="font-medium">{emails[selectedEmail].sender}</h2>
                  <p className="text-sm text-muted-foreground">{emails[selectedEmail].subject}</p>
                  {emails[selectedEmail].reply && (
                    <p className="text-xs text-muted-foreground">{emails[selectedEmail].reply}</p>
                  )}
                </div>
              </div>
              
              <div className="prose max-w-none">
                <p>{emails[selectedEmail].content}</p>
                {selectedEmail === 0 && (
                  <>
                    <p className="mt-4">Please come prepared with any questions or insights you may have. Looking forward to our meeting!</p>
                    <p className="mt-4">Best regards,<br />William</p>
                  </>
                )}
              </div>
              
              <div className="mt-8">
                <div className="flex items-center space-x-2 mb-4">
                  <input type="checkbox" id="mute" className="rounded border-input" />
                  <label htmlFor="mute" className="text-sm">Mute this thread</label>
                </div>
                
                <div className="border border-border rounded-lg p-4">
                  <textarea
                    placeholder="Reply William Smith..."
                    className="w-full h-32 bg-background border-0 focus:ring-0 resize-none"
                  ></textarea>
                  <div className="flex justify-end mt-2">
                    <button className="px-4 py-1 bg-primary text-primary-foreground rounded shadow-sm">
                      Send
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}