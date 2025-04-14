import React, { useState ,useEffect} from 'react';
import { Plus, BookOpen, ArrowRight, X,Edit, Delete } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

interface Book {
  id: string;
  title: string;
  author: string;
  category: string;
  condition: string;
  imageUrl: string;
  status: 'available' | 'exchanged' | 'pending';
  location: string;
  createdBy: string;
  phone: string;
}

interface Exchange {
  id: string;
  date: string;
  book: Book;
  type: 'given' | 'received';
  withUser: string;
}

export const ProfilePage = () => {
  const { user,updateUser } = useAuth();
  const [activeTab, setActiveTab] = useState<'books' | 'my'>('books');
  const [myBooks, setMyBooks] = useState<Book[]>([]);
  const [books,setBooks]=useState<Book[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [newBook, setNewBook] = useState({
      "id":"",
      "title": "",
      "author": "",
      "category": "",
      "status":"available",
      "condition": "",
      "imageUrl": "",
      "location":"",
      "createdBy":""
    });
    const [editMode, setEditMode] = useState(false);
    const [userData, setUserData] = useState({
      name: '',
      phone: ''
    });

    useEffect(() => {
      if (user) {
        setUserData({
          name: user.name || '',
          phone: user.phone || ''
        });
      }
    }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      
      const token = localStorage.getItem("token"); // Retrieve the token
  
      if (!token) {
        console.error("No token found!");
        return;
      }
      
      const isEditing = newBook.id;
      console.log("isEdit:",isEditing);
      console.log("newBook",newBook.id);
      const url = isEditing
        ? `${process.env.REACT_APP_API_URL}/api/books/${newBook.id}`
        : '${process.env.REACT_APP_API_URL}/api/books';
    
      const method = isEditing ? 'PUT' : 'POST';
      const bookData = {
        title: newBook.title,
        author: newBook.author,
        category: newBook.category,
        status: newBook.status,
        condition: newBook.condition,
        imageUrl: newBook.imageUrl,
        location: newBook.location,
        ...(isEditing ? {} : { createdBy: user?.id }) // Set createdBy only on creation
      };

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json',Authorization: `Bearer ${token}`, },
        body: JSON.stringify(bookData)

      });

      console.log(response.ok);

      if (response.ok) {
        const addedBook = await response.json();
        console.log("kaam bn rha h")
        //setBooks([...books, addedBook]);
        if (isEditing) {
          setMyBooks(books =>
            books.map(book => (book.id === addedBook.id ? { ...addedBook, id: addedBook._id } : book))
          );
        } else {
          setMyBooks(books => [...books, {...addedBook, id:addedBook._id}]);
        }
        setShowForm(false);
        setNewBook({"id":"","title": "", "author": "", "category": "","createdBy":"","status":"available", "condition": "", "imageUrl": "", "location":""});
      }
    };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      setNewBook({ ...newBook, [e.target.name]: e.target.value });
    };
  

  const handleEdit = (book: Book) => {
    setNewBook({
      id: book.id,
      title: book.title,
      author: book.author,
      category: book.category,
      status: book.status,
      condition: book.condition,
      imageUrl: book.imageUrl,
      location: book.location || '',
      createdBy: book.createdBy || ''
    });
    setShowForm(true);
  };


  const handleDelete = async (id: string) => {
    const confirmDelete = window.confirm('Are you sure you want to delete this book?');
    if (!confirmDelete) return;
  
    const token = localStorage.getItem('token');
    if (!token) {
      console.error('No token found!');
      return;
    }
  
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/books/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        },
      });
      
      console.log(response.ok);
      if (response.ok) {
        setMyBooks(myBooks.filter(book => book.id !== id));
      } else {
        console.error('Failed to delete book');
      }
    } catch (error) {
      console.error('Error deleting book:', error);
    }
  };

  const handleProfileUpdate = async () => {
    const token = localStorage.getItem('token');
    if (!token || !user) return;
  
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/users/me`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          name: userData.name,
          phone: userData.phone
        })
      });
  
      if (response.ok) {
        const updatedUser = await response.json();
        // Update auth context if available
        if (updateUser) {
          updateUser({
            name: updatedUser.name,
            phone: updatedUser.phone
          });
        }
        setEditMode(false);
      }
    } catch (error) {
      console.error('Update failed:', error);
    }
  };

  useEffect(() => {
    const fetchBooks = async () => {
      if (!user) return;
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/prof`,{
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
        const data = await response.json();
        const mappedBooks = data.map((book: any) => ({
          id: book._id, // Map _id to id
          title: book.title,
          author: book.author,
          category: book.category,
          condition: book.condition,
          imageUrl: book.imageUrl,
          status: book.status,
          location: book.location,
          createdBy: book.createdBy,
          phone: book.phone,
        }));
        setMyBooks(mappedBooks);
      } catch (error) {
        console.error('Error fetching books:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchBooks();
  }, [user]);

  return (
    <div className="container mx-auto px-4 py-8">
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

        {!showForm && (
          <div className="relative bg-white rounded-lg shadow-md p-6 mb-8">
            {!editMode && (
              <button
               onClick={() => setEditMode(true)}
               className="absolute top-4 right-4 px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 flex items-center text-sm"
              >
                <Edit className="inline mr-1 h-4 w-4" />
               Edit
             </button>
          )}

          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
              <span className="text-2xl text-blue-600">
                {user?.name?.[0].toUpperCase() || 'U'}
              </span>
            </div>
            <div className="flex-1">
              {editMode ? (
                <>
                  <input
                    type="text"
                    value={userData.name}
                    onChange={(e) => setUserData({ ...userData, name: e.target.value })}
                    className="text-2xl font-bold text-gray-900 bg-white border rounded p-1 mb-2 w-full"
                  />
                  <input
                    type="tel"
                    value={userData.phone}
                    onChange={(e) => setUserData({ ...userData, phone: e.target.value })}
                    className="text-2xl font-bold text-gray-900 bg-white border rounded p-1 w-full"
                  />

                  <div className="mt-4 flex gap-2">
                    <button
                      onClick={handleProfileUpdate}
                      className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                    >
                      Save
                    </button>
                    <button
                      onClick={() => {
                        setEditMode(false);
                        setUserData({
                          name: user?.name || '',
                          phone: user?.phone || ''
                        });
                      }}
                      className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
                    >
                      Cancel
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <h2 className="text-2xl font-bold text-gray-900">{user?.name||"Bookswap"}</h2>
                  <h2 className="text-2xl font-bold text-gray-900">{user?.phone}</h2>
                  <p className="text-gray-600">Member since {new Date().getFullYear()}</p>
                </>
              )}
            </div>
          </div>
        </div>)}


      <div className="mb-6">
        <div className="flex border-b border-gray-200">
          <button
            className={`px-6 py-3 font-medium text-sm ${
              activeTab === 'books'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
            onClick={() => setActiveTab('books')}
          >
            My Books
          </button>
          <button 
            className={`px-6 py-3 font-medium text-sm ${
              activeTab === 'my'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
            onClick={() => setActiveTab('my')}>
             Available for Exchange
          </button>
        </div>
      </div>

      {activeTab === 'books' ? (
        <div>
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-semibold text-gray-900">My Books</h3>
            <button onClick={() => setShowForm(true)} className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
              <Plus className="h-5 w-5" />
              <span>Add Book</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {myBooks.map(book => (
              <div key={book.id} className="bg-gray-100 rounded-lg shadow-md overflow-hidden">
                <div className="flex gap-1 mt-2">
                <img
                  src={book.imageUrl}
                  alt={book.title}
                  className="w-full h-48 object-cover"
                />
                <div className='flex grid item-center bg-gray-100 m-1 gap-between p-2'>
                  <Edit
                    onClick={() => handleEdit(book)}
                    className="text-blue-600 mt-2 hover:underline text-sm"
                  />
                  <Delete
                    onClick={() => handleDelete(book.id)}
                    className="text-red-600 hover:underline text-sm"
                  />
                  </div>
                </div>
                <div className="p-4">
                  <h4 className="text-lg font-semibold text-gray-900 mb-1">
                    {book.title}
                  </h4>
                  <p className="text-gray-600 mb-2">{book.author}</p>
                  <div className="flex flex-wrap gap-2 mb-3">
                    <span className="px-2 py-1 bg-blue-100 text-blue-800 text-sm rounded-full">
                      {book.category}
                    </span>
                    <span
                      className={`px-2 py-1 text-sm rounded-full ${
                        book.status === 'available'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-yellow-100 text-yellow-800'
                      }`}
                    >
                      {book.status.charAt(0).toUpperCase() + book.status.slice(1)}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div>
        <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-semibold text-gray-900">Books for Exchange</h3>
        <button onClick={() => setShowForm(true)} className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
              <Plus className="h-5 w-5" />
              <span>Add Book</span>
            </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">        
            {myBooks
            .filter(book => book.status==='available')
            .map(book => (
              <div key={book.id} className="bg-gray-100 rounded-lg shadow-md overflow-hidden">
                <div className="flex gap-1 mt-2">
                <img
                  src={book.imageUrl}
                  alt={book.title}
                  className="w-full h-48 object-cover"
                />
                <div className='flex grid item-center bg-gray-100 m-1 gap-between p-2'>
                  <Edit
                    onClick={() => handleEdit(book)}
                    className="text-blue-600 mt-2 hover:underline text-sm"
                  />
                  <Delete
                    onClick={() => handleDelete(book.id)}
                    className="text-red-600 hover:underline text-sm"
                  />
                  </div>
                </div>
                <div className="p-4">
                  <h4 className="text-lg font-semibold text-gray-900 mb-1">
                    {book.title}
                  </h4>
                  <p className="text-gray-600 mb-2">{book.author}</p>
                  <div className="flex flex-wrap gap-2 mb-3">
                    <span className="px-2 py-1 bg-blue-100 text-blue-800 text-sm rounded-full">
                      {book.category}
                    </span>
                    <span
                      className={`px-2 py-1 text-sm rounded-full ${
                        book.status === 'available'
                          ? 'bg-green-100 text-green-800'
                          : book.status === 'exchanged'
                          ? 'bg-gray-100 text-gray-800'
                          : 'bg-yellow-100 text-yellow-800'
                      }`}
                    >
                      {book.status.charAt(0).toUpperCase() + book.status.slice(1)}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
          </div>
      )}
    </div>
  );
};