'use client';

import { useState } from 'react';
import { 
  Users, 
  MessageSquare, 
  MapPin, 
  Calendar,
  ThumbsUp,
  Share2,
  Bookmark,
  Search,
  Plus,
  UserCircle
} from 'lucide-react';

interface Post {
  id: number;
  author: string;
  role: string;
  avatar: string;
  content: string;
  region: string;
  time: string;
  likes: number;
  comments: number;
  isBookmarked: boolean;
}

const posts: Post[] = [
  {
    id: 1,
    author: 'Ahmed Ibrahim',
    role: 'Pastoralist',
    avatar: 'AI',
    content: 'Water levels at our traditional borehole in Shabelle have dropped significantly this season. We are now walking 8km to find water for our cattle. Has anyone in neighboring woredas experienced similar conditions?',
    region: 'Somali Region / Shabelle',
    time: '3 hours ago',
    likes: 24,
    comments: 12,
    isBookmarked: false
  },
  {
    id: 2,
    author: 'Dr. Fatima Hassan',
    role: 'Veterinarian - NGO',
    avatar: 'FH',
    content: '🚨 PPR Vaccination Campaign Update: We completed vaccinations in Jijiga and Awbare woredas this week. Over 15,000 goats and sheep vaccinated. Next week we move to Korahey zone. Please spread the word to fellow herders!',
    region: 'Somali Region / Jijiga',
    time: '5 hours ago',
    likes: 56,
    comments: 18,
    isBookmarked: true
  },
  {
    id: 3,
    author: 'Kebede Tadesse',
    role: 'Government Officer',
    avatar: 'KT',
    content: 'The new early warning system has detected declining vegetation trends in Borena zone. We are coordinating with WFP for pre-positioning of supplementary feed. Community leaders, please prepare your contingency plans.',
    region: 'Oromia Region / Borena',
    time: '1 day ago',
    likes: 42,
    comments: 23,
    isBookmarked: false
  },
  {
    id: 4,
    author: 'Amina Mohamed',
    role: 'Community Leader',
    avatar: 'AM',
    content: 'Successful community meeting held in Danan woreda yesterday. We discussed rotational grazing strategies for the dry season ahead. 47 households committed to the plan. Together we can protect our pasturelands! 🌱',
    region: 'Somali Region / Nogob',
    time: '1 day ago',
    likes: 89,
    comments: 31,
    isBookmarked: true
  }
];

export default function CommunityPanel() {
  const [activeTab, setActiveTab] = useState<'feed' | 'directory' | 'events'>('feed');
  const [newPost, setNewPost] = useState('');

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
          <Users className="w-6 h-6 text-green-600" />
          Community Hub
        </h2>
        <p className="text-sm text-gray-500 mt-1">
          Connect with pastoralists, NGOs, government officials, and experts across Ethiopia
        </p>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-xl p-1 shadow-sm border border-gray-100 inline-flex">
        {[
          { id: 'feed', label: 'Community Feed', icon: MessageSquare },
          { id: 'directory', label: 'Member Directory', icon: Users },
          { id: 'events', label: 'Events & Meetings', icon: Calendar }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as typeof activeTab)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              activeTab === tab.id ? 'bg-green-100 text-green-700' : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <tab.icon className="w-4 h-4" />
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === 'feed' && (
        <>
          {/* New Post */}
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-full bg-green-600 flex items-center justify-center text-white font-semibold flex-shrink-0">
                U
              </div>
              <div className="flex-1">
                <textarea
                  value={newPost}
                  onChange={(e) => setNewPost(e.target.value)}
                  placeholder="Share updates, ask questions, or report conditions from your area..."
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 outline-none resize-none"
                />
                <div className="flex items-center justify-between mt-3">
                  <div className="flex items-center gap-2">
                    <button className="flex items-center gap-1 px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                      <MapPin className="w-4 h-4" />
                      Add Location
                    </button>
                    <button className="flex items-center gap-1 px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                      📷 Add Photo
                    </button>
                  </div>
                  <button 
                    disabled={!newPost.trim()}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium"
                  >
                    Post
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Posts Feed */}
          <div className="space-y-4">
            {posts.map((post) => (
              <div key={post.id} className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
                {/* Author */}
                <div className="flex items-start gap-3 mb-4">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center text-white font-semibold flex-shrink-0">
                    {post.avatar}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-gray-800">{post.author}</span>
                      <span className="px-2 py-0.5 bg-gray-100 text-gray-600 rounded-full text-xs">
                        {post.role}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-gray-500 mt-1">
                      <MapPin className="w-3 h-3" />
                      {post.region}
                      <span>•</span>
                      <Calendar className="w-3 h-3" />
                      {post.time}
                    </div>
                  </div>
                </div>

                {/* Content */}
                <p className="text-gray-700 mb-4 leading-relaxed">{post.content}</p>

                {/* Actions */}
                <div className="flex items-center gap-4 pt-4 border-t border-gray-100">
                  <button className="flex items-center gap-2 text-gray-500 hover:text-blue-600 transition-colors">
                    <ThumbsUp className="w-4 h-4" />
                    <span className="text-sm">{post.likes}</span>
                  </button>
                  <button className="flex items-center gap-2 text-gray-500 hover:text-green-600 transition-colors">
                    <MessageSquare className="w-4 h-4" />
                    <span className="text-sm">{post.comments}</span>
                  </button>
                  <button className="flex items-center gap-2 text-gray-500 hover:text-purple-600 transition-colors ml-auto">
                    <Share2 className="w-4 h-4" />
                  </button>
                  <button className={`flex items-center gap-2 ${post.isBookmarked ? 'text-yellow-500' : 'text-gray-500'} hover:text-yellow-500 transition-colors`}>
                    <Bookmark className={`w-4 h-4 ${post.isBookmarked ? 'fill-current' : ''}`} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {activeTab === 'directory' && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-4 border-b border-gray-100">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input 
                type="text"
                placeholder="Search members by name, organization, or region..."
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
              />
            </div>
          </div>

          <div className="divide-y divide-gray-100">
            {[
              { name: 'Ahmed Ibrahim', role: 'Pastoralist', region: 'Shabelle Zone', org: 'Community Member', joined: '2023-06' },
              { name: 'Dr. Fatima Hassan', role: 'Veterinary Officer', region: 'Jijiga Zone', org: 'FAO Ethiopia', joined: '2022-03' },
              { name: 'Kebede Tadesse', role: 'Government Official', region: 'Borena Zone', org: 'NDRMC', joined: '2023-01' },
              { name: 'Amina Mohamed', role: 'Community Leader', region: 'Nogob Zone', org: 'Women\'s Cooperative', joined: '2023-09' },
              { name: 'Mohamed Ali', role: 'NGO Worker', region: 'Dollo Zone', org: 'Save the Children', joined: '2023-04' }
            ].map((member, index) => (
              <div key={index} className="p-4 hover:bg-gray-50 transition-colors">
                <div className="flex items-center gap-4">
                  <UserCircle className="w-12 h-12 text-gray-300" />
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-800">{member.name}</h4>
                    <p className="text-sm text-gray-600">{member.role} • {member.org}</p>
                    <div className="flex items-center gap-2 mt-1 text-xs text-gray-500">
                      <MapPin className="w-3 h-3" />
                      {member.region}
                      <span>•</span>
                      Joined {member.joined}
                    </div>
                  </div>
                  <button className="px-3 py-1.5 text-sm border border-green-200 text-green-600 rounded-lg hover:bg-green-50 transition-colors">
                    Connect
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'events' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            {
              title: 'Drought Response Coordination Meeting',
              date: 'Jan 25, 2024',
              time: '10:00 AM',
              location: 'Jijiga Town Hall',
              organizer: 'NDRMC Somali Region',
              attendees: 45,
              type: 'Meeting'
            },
            {
              title: 'PPR Vaccination Training',
              date: 'Jan 28, 2024',
              time: '9:00 AM',
              location: 'Kebribeyah Health Center',
              organizer: 'FAO Ethiopia',
              attendees: 30,
              type: 'Training'
            },
            {
              title: 'Community Grazing Planning Session',
              date: 'Feb 01, 2024',
              time: '2:00 PM',
              location: 'Danan Community Center',
              organizer: 'Danana Pastoral Association',
              attendees: 60,
              type: 'Workshop'
            },
            {
              title: 'Early Warning System Review',
              date: 'Feb 05, 2024',
              time: '11:00 AM',
              location: 'Virtual (Zoom)',
              organizer: 'PastureAI Technical Team',
              attendees: 25,
              type: 'Webinar'
            }
          ].map((event, index) => (
            <div key={index} className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-3">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  event.type === 'Meeting' ? 'bg-blue-100 text-blue-700' :
                  event.type === 'Training' ? 'bg-purple-100 text-purple-700' :
                  event.type === 'Workshop' ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'
                }`}>
                  {event.type}
                </span>
                <Bookmark className="w-5 h-5 text-gray-300 hover:text-yellow-500 cursor-pointer" />
              </div>
              <h3 className="font-semibold text-gray-800 mb-2">{event.title}</h3>
              <div className="space-y-1 text-sm text-gray-600">
                <p className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-gray-400" />
                  {event.date} at {event.time}
                </p>
                <p className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-gray-400" />
                  {event.location}
                </p>
                <p className="text-xs text-gray-500 mt-2">Organized by {event.organizer}</p>
              </div>
              <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between">
                <span className="text-sm text-gray-500">{event.attendees} attending</span>
                <button className="px-3 py-1.5 text-sm bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
                  RSVP
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
