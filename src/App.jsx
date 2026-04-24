import { BrowserRouter, Routes, Route, Link, useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc } from "firebase/firestore";
import { db } from "./db";
import "./App.css";

function Home() {
    const [contacts, setContacts] = useState([]);
    const [search, setSearch] = useState("");

    useEffect(() => {
        getDocs(collection(db, "contacts")).then((snapshot) => {
            const data = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
            data.sort((a, b) => a.lastName.localeCompare(b.lastName));
            setContacts(data);
        });
    }, []);

    const filtered = contacts.filter((c) =>
        (c.firstName + " " + c.lastName)
            .toLowerCase()
            .includes(search.toLowerCase())
    );

    return (
        <div className="container">
            <h1>Contact Book</h1>
            <Link to="/new" className="btn">+ Add Contact</Link>
            <input
                className="search"
                placeholder="Search contacts..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
            />
            <ul className="contact-list">
                {filtered.map((c) => (
                    <li key={c.id}>
                        <Link to={`/contact/${c.id}`}>
                            {c.lastName}, {c.firstName}
                        </Link>
                    </li>
                ))}
            </ul>
        </div>
    );
}

function ContactDetails() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [contact, setContact] = useState(null);

    useEffect(() => {
        getDocs(collection(db, "contacts")).then((snapshot) => {
            const found = snapshot.docs.find((d) => d.id === id);
            if (found) setContact({ id: found.id, ...found.data() });
        });
    }, [id]);

    function handleDelete() {
        if (confirm("Delete this contact?")) {
            deleteDoc(doc(db, "contacts", id)).then(() => navigate("/"));
        }
    }

    if (!contact) return <p className="loading">Loading...</p>;

    return (
        <div className="container">
            <h2>{contact.firstName} {contact.lastName}</h2>
            <div className="detail-card">
                <p><strong>Email:</strong> {contact.email}</p>
                {contact.phone && <p><strong>Phone:</strong> {contact.phone}</p>}
                {contact.address && <p><strong>Address:</strong> {contact.address}</p>}
            </div>
            <div className="actions">
                <Link to={`/edit/${id}`} className="btn">Edit</Link>
                <button onClick={handleDelete} className="btn btn-danger">Delete</button>
            </div>
            <Link to="/" className="back-link">Back to Contacts</Link>
        </div>
    );
}

function NewContact() {
    const navigate = useNavigate();
    const [form, setForm] = useState({ firstName: "", lastName: "", email: "", phone: "", address: "" });

    function handleChange(e) {
        setForm({ ...form, [e.target.name]: e.target.value });
    }

    function handleSubmit(e) {
        e.preventDefault();
        addDoc(collection(db, "contacts"), form).then((ref) => {
            navigate(`/contact/${ref.id}`);
        });
    }

    return (
        <div className="container">
            <h2>New Contact</h2>
            <form onSubmit={handleSubmit}>
                <input name="firstName" placeholder="First Name" value={form.firstName} onChange={handleChange} required />
                <input name="lastName" placeholder="Last Name" value={form.lastName} onChange={handleChange} required />
                <input name="email" type="email" placeholder="Email" value={form.email} onChange={handleChange} required />
                <input name="phone" placeholder="Phone (optional)" value={form.phone} onChange={handleChange} />
                <input name="address" placeholder="Address (optional)" value={form.address} onChange={handleChange} />
                <button type="submit" className="btn">Save Contact</button>
            </form>
            <Link to="/" className="back-link">Cancel</Link>
        </div>
    );
}

function EditContact() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [form, setForm] = useState(null);

    useEffect(() => {
        getDocs(collection(db, "contacts")).then((snapshot) => {
            const found = snapshot.docs.find((d) => d.id === id);
            if (found) setForm({ ...found.data() });
        });
    }, [id]);

    function handleChange(e) {
        setForm({ ...form, [e.target.name]: e.target.value });
    }

    function handleSubmit(e) {
        e.preventDefault();
        updateDoc(doc(db, "contacts", id), form).then(() => {
            navigate(`/contact/${id}`);
        });
    }

    if (!form) return <p className="loading">Loading...</p>;

    return (
        <div className="container">
            <h2>Edit Contact</h2>
            <form onSubmit={handleSubmit}>
                <input name="firstName" placeholder="First Name" value={form.firstName} onChange={handleChange} required />
                <input name="lastName" placeholder="Last Name" value={form.lastName} onChange={handleChange} required />
                <input name="email" type="email" placeholder="Email" value={form.email} onChange={handleChange} required />
                <input name="phone" placeholder="Phone (optional)" value={form.phone || ""} onChange={handleChange} />
                <input name="address" placeholder="Address (optional)" value={form.address || ""} onChange={handleChange} />
                <button type="submit" className="btn">Update Contact</button>
            </form>
            <Link to={`/contact/${id}`} className="back-link">Cancel</Link>
        </div>
    );
}

export default function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/contact/:id" element={<ContactDetails />} />
                <Route path="/new" element={<NewContact />} />
                <Route path="/edit/:id" element={<EditContact />} />
            </Routes>
        </BrowserRouter>
    );
}