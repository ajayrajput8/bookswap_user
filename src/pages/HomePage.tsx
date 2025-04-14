import React, { useState,useEffect } from 'react';
import { Plus, Search, LocateIcon, User, X, PhoneCall } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import {useAuth} from '../contexts/AuthContext'

interface Book {
  id: string;
  title: string;
  author: string;
  category: string;
  status: string,
  phone: string;
  location: string;
  createdBy: string,
  imageUrl: string,
  creator: string
}


export const HomePage = () => {
  const [books,setBooks]=useState<Book[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showForm, setShowForm] = useState(false);
  const [newBook, setNewBook] = useState({
    "title": "",
    "author": "",
    "category": "",
    "status":"available",
    "imageUrl": "",
    "location":"",
    "createdBy":"",
    "phone":"",
    "creator":""
  });

  const navigate = useNavigate();
  const {logout} = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Failed to log out:', error);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      handleLogout;
      return;
    }

    fetch(`${import.meta.env.VITE_API_URL}/api/books`)
      .then(response => response.json())
      .then(data => {if (Array.isArray(data)) {
        setBooks(data);
      } else {
        // If data is an object, extract the array (adjust based on actual response)
        console.error('Unexpected data structure:', data);
        setBooks([]); // Fallback to empty array
      }})
      .catch(error => console.error('Error fetching books:', error));
  }, []);

  const categories = ['all', 'fiction', 'self-dev', 'biopic', 'inspiring', 'story', 'love'];

  const filteredBooks = books.filter(book => {
    const matchesSearch = book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         book.author.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || book.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setNewBook({ ...newBook, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const token = localStorage.getItem("token"); // Retrieve the token

    if (!token) {
      console.error("No token found!");
      return;
    }

    const response = await fetch(`${import.meta.env.VITE_API_URL}/api/books`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json',Authorization: `Bearer ${token}`, },
      body: JSON.stringify(newBook)
    });
    if (response.ok) {
      const addedBook = await response.json();
      setBooks([...books, addedBook]);
      setShowForm(false);
      setNewBook({"title": "", "author": "", "category": "","createdBy":"","status":"available", "phone": "", "imageUrl": "", "location":"","creator":""});
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/*{showForm && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50">
          <div className="bg-white p-4 sm:p-6 rounded-lg w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Add New Book</h2>
              <X className="cursor-pointer" onClick={() => setShowForm(false)} />
            </div>
            <form onSubmit={handleSubmit} className="space-y-3">
              <input type="text" name="title" placeholder="Title" className="w-full border p-2" onChange={handleInputChange} required />
              <input type="text" name="author" placeholder="Author" className="w-full border p-2" onChange={handleInputChange} required />
              <input type="text" name="imageUrl" placeholder="Image URL" className="w-full border p-2" onChange={handleInputChange} />
              <input type="text" name="location" placeholder="Location" className='w-full border p-2' onChange={handleInputChange}/>
              <select name="category" className="w-full border p-2" onChange={handleInputChange} required>
                <option value="">Select Category</option>
                <option value="fiction">Fiction</option>
                <option value="love">Love</option>
                <option value="self-dev">Self Develpment</option>
                <option value="biopic">Biography</option>
                <option value="inspiring">Inspiring</option>
                <option value="story">Story</option>
              </select>
              <select name="status" className="w-full border p-2" onChange={handleInputChange} required>
                <option value="">Select Status</option>
                <option value="available">Available</option>
                <option value="unavailable">Unavailable</option>
              </select>
              <button type="submit" className="w-full bg-blue-600 text-white p-2 rounded">Submit</button>
            </form>
          </div>
        </div>
      )}*/}

        {showForm && (
          <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50 px-4">
            <div className="bg-white p-4 sm:p-6 rounded-lg w-full max-w-md">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg sm:text-xl font-bold">Add New Book</h2>
                <X className="cursor-pointer" onClick={() => setShowForm(false)} />
              </div>
              <form onSubmit={handleSubmit} className="space-y-3">
                <input
                  type="text"
                  name="title"
                  placeholder="Title"
                  className="w-full border p-2"
                  onChange={handleInputChange}
                  required
                />
                <input
                  type="text"
                  name="author"
                  placeholder="Author"
                  className="w-full border p-2"
                  onChange={handleInputChange}
                  required
                />
                <input
                  type="text"
                  name="imageUrl"
                  placeholder="Image URL"
                  className="w-full border p-2"
                  onChange={handleInputChange}
                />
                <input
                  type="text"
                  name="location"
                  placeholder="Location"
                  className="w-full border p-2"
                  onChange={handleInputChange}
                />
                <select
                  name="category"
                  className="w-full border p-2"
                  onChange={handleInputChange}
                  required
                >
                  <option value="">Select Category</option>
                  <option value="fiction">Fiction</option>
                  <option value="love">Love</option>
                  <option value="self-dev">Self Development</option>
                  <option value="biopic">Biography</option>
                  <option value="inspiring">Inspiring</option>
                  <option value="story">Story</option>
                </select>
                <select
                  name="status"
                  className="w-full border p-2"
                  onChange={handleInputChange}
                  required
                >
                  <option value="">Select Status</option>
                  <option value="available">Available</option>
                  <option value="unavailable">Unavailable</option>
                </select>
                <button
                  type="submit"
                  className="w-full bg-blue-600 text-white p-2 rounded"
                >
                  Submit
                </button>
              </form>
            </div>
          </div>
        )}


      <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
        <div className="flex max-w-xl">
          <Search className="absolute top-32 left-36 text-gray-400 h-5 w-5" />
          <input
            type="text"
            placeholder="Search books by title or author..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex gap-4">
          <select
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            {categories.map(category => (
              <option key={category} value={category}>
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </option>
            ))}
          </select>
          <button onClick={() => setShowForm(true)} className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            <Plus  className="h-5 w-5" />
            <span onClick={() => setShowForm(true)} >Add Book</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredBooks
        .filter(book => book.status==='available')
        .map((book,index) => (
          <div key={book.id||index} className="bg-white rounded-lg shadow-md overflow-hidden"> 
            <img
              src={book.imageUrl}
              alt={book.title}
              className="w-full h-48 object-cover"
            />
            <div className="p-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-1">{book.title}</h3>
              <p className="text-gray-600 mb-2">{book.author}</p>
              <div className="flex flex-wrap gap-2 mb-3">
                <span className="px-2 py-1 bg-green-100 text-green-800 text-sm rounded-full">
                  {book.location}
                </span>
                <span className="px-2 py-1 bg-blue-100 text-blue-800 text-sm rounded-full">
                  {book.category}
                </span>
                {/*<span className="px-2 py-1 bg-red-100 text-red-800 text-sm rounded-full">
                  {book.condition}
                </span>*/}
                
              </div>
              
              <p className="text-gray-500 text-sm flex items-center">
                <User className="h-4 w-4 mr-1" />
                {book.createdBy}
              </p>
              <p className="text-gray-500 text-sm flex items-center">
                <PhoneCall className="h-4 w-4 mr-1" />
                {book.phone}
              </p>
            </div>
          </div>
        ))}
      </div>

      {filteredBooks.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">No books found matching your criteria</p>
        </div>
      )}
    </div>
  );
};