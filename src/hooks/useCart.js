import { useState, useEffect, useMemo } from "react";
import { db } from "../data/db";

export const useCart = () => {
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

        // State Derivado
        const isEmpty = useMemo ( () => cart.length === 0, [cart.length]);
        const cartTotal = useMemo( () => cart.reduce((total, item) => total + (item.price * item.quantity), 0), [cart]);


    return {
        data,
        cart,
        addToCart,
        removeFromCart,
        incrementQuantity,
        decrementQuantity,
        clearCart,
        isEmpty,
        cartTotal
    }
}

