import React, { useState } from 'react';
import { Check, X, BookOpen, User } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

interface ExchangeRequest {
  id: string;
  date: string;
  book: {
    id: string;
    title: string;
    author: string;
    imageUrl: string;
  };
  requester: {
    id: string;
    name: string;
    email: string;
  };
  status: 'pending' | 'accepted' | 'rejected';
}

export const ActivityPage = () => {
  const { user } = useAuth();
  const [requests, setRequests] = useState<ExchangeRequest[]>([
    {
      id: '1',
      date: '2024-03-20',
      book: {
        id: '1',
        title: 'The Great Gatsby',
        author: 'F. Scott Fitzgerald',
        imageUrl: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&q=80&w=400&h=500'
      },
      requester: {
        id: '123',
        name: 'John Smith',
        email: 'john@example.com'
      },
      status: 'pending'
    },
    {
      id: '2',
      date: '2024-03-19',
      book: {
        id: '2',
        title: 'To Kill a Mockingbird',
        author: 'Harper Lee',
        imageUrl: 'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?auto=format&fit=crop&q=80&w=400&h=500'
      },
      requester: {
        id: '124',
        name: 'Emma Wilson',
        email: 'emma@example.com'
      },
      status: 'pending'
    }
  ]);

  const handleAccept = (requestId: string) => {
    setRequests(requests.map(request =>
      request.id === requestId
        ? { ...request, status: 'accepted' }
        : request
    ));
  };

  const handleReject = (requestId: string) => {
    setRequests(requests.map(request =>
      request.id === requestId
        ? { ...request, status: 'rejected' }
        : request
    ));
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Exchange Requests</h2>
        
        {requests.length === 0 ? (
          <p className="text-gray-500 text-center py-8">No pending exchange requests</p>
        ) : (
          <div className="space-y-6">
            {requests.map(request => (
              <div
                key={request.id}
                className={`bg-white border rounded-lg p-4 ${
                  request.status === 'pending'
                    ? 'border-yellow-200 bg-yellow-50'
                    : request.status === 'accepted'
                    ? 'border-green-200 bg-green-50'
                    : 'border-red-200 bg-red-50'
                }`}
              >
                <div className="flex items-start space-x-4">
                  <img
                    src={request.book.imageUrl}
                    alt={request.book.title}
                    className="w-24 h-32 object-cover rounded-md"
                  />
                  <div className="flex-1">
                    <div className="flex items-center mb-2">
                      <BookOpen className="h-4 w-4 text-gray-500 mr-2" />
                      <h3 className="font-semibold text-gray-900">
                        {request.book.title}
                      </h3>
                    </div>
                    <p className="text-gray-600 text-sm mb-2">
                      by {request.book.author}
                    </p>
                    <div className="flex items-center text-sm text-gray-500 mb-2">
                      <User className="h-4 w-4 mr-2" />
                      <span>Requested by {request.requester.name}</span>
                    </div>
                    <p className="text-sm text-gray-500">
                      Requested on {new Date(request.date).toLocaleDateString()}
                    </p>
                  </div>
                  
                  {request.status === 'pending' ? (
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleAccept(request.id)}
                        className="flex items-center px-3 py-1 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
                      >
                        <Check className="h-4 w-4 mr-1" />
                        Accept
                      </button>
                      <button
                        onClick={() => handleReject(request.id)}
                        className="flex items-center px-3 py-1 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
                      >
                        <X className="h-4 w-4 mr-1" />
                        Reject
                      </button>
                    </div>
                  ) : (
                    <span
                      className={`px-3 py-1 rounded-full text-sm ${
                        request.status === 'accepted'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};