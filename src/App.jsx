
import { useState, useEffect } from "react";
import Header from "./components/Header"
import Footer from "./components/Footer"
import Guitar from "./components/Guitar"
import { db } from "./data/db"

function App() {

    // Mantener items en el carrito y la base de datos
    const initialCart = () => {
        const savedCart = localStorage.getItem('cart');
        return savedCart ? JSON.parse(savedCart) : [];
    }
    

   const [data] = useState(db);
   const [cart, setCart] = useState(initialCart);

   const MAX_ITEMS = 10; // Maximo de guitarras por item
   const MIN_ITEMS = 1; // Minimo de guitarras por item

   // Guardar el carrito en el localStorage
   useEffect(() => {      
    localStorage.setItem('cart', JSON.stringify(cart));
   }, [cart]);

    // Funcion para añadir guitarras al carrito
   // Si la guitarra ya existe, incrementa la cantidad
   // Si no existe, añade al carrito con cantidad 1
   function addToCart(item) {
    const itemExists = cart.findIndex(guitar => guitar.id === item.id);
    if (itemExists >= 0) { // Existe en el carrito
        // Verificar si ya alcanzó el límite
        if (cart[itemExists].quantity < MAX_ITEMS) {
            const updatedCart = [...cart];
            updatedCart[itemExists].quantity += 1; // Incrementar cantidad
            setCart(updatedCart);
        } else {
            alert("No puedes agregar más de 10 unidades de este producto.");
        }
    } else {
        // Añadir al carrito con cantidad inicial de 1
        item.quantity = 1;
        setCart([...cart, item]);
    }
}
    // Funcion para eliminar guitarras del carrito
   function removeFromCart(id) {
    setCart(prevCart => prevCart.filter(guitar => guitar.id !== id));
   }

   // Incrementar cantidad de guitarras en el carrito
    function incrementQuantity(id) {
        setCart(prevCart => 
            prevCart.map(guitar => 
                guitar.id === id && guitar.quantity < MAX_ITEMS ? { ...guitar, quantity: guitar.quantity + 1 } : guitar
            )
        );
    }
    // Decrementar cantidad de guitarras en el carrito
    function decrementQuantity(id) {
        setCart(prevCart => 
            prevCart.map(guitar => 
                guitar.id === id && guitar.quantity > MIN_ITEMS ? { ...guitar, quantity: guitar.quantity - 1 } : guitar
            )  
        )};

    // Vaciar el carrito
    function clearCart() {
        setTimeout(() => {
            setCart([]);
        }, 500);
        
    }

  return (
    <>

    <Header 
        cart={cart}
        removeFromCart={removeFromCart}
        incrementQuantity={incrementQuantity}
        decrementQuantity={decrementQuantity}
        clearCart={clearCart}
    />
    <main className="container-xl mt-5">
        <h2 className="text-center">Nuestra Colección</h2>

        <div className="row mt-5">
            {data.map((guitar) => (
                <Guitar 
                    key={guitar.id}
                    guitar={guitar}
                    setCart={setCart}
                    addToCart={addToCart}
                />  
                )
            )}
            
        </div>
    </main>

    <Footer />


    </>
  )
}

export default App
