import { ReactNode, createContext, useContext, useState } from "react"
import ShoppingCart from "../components/ShoppingCart"

type ShoppingCartProviderProps = {
    children: ReactNode
}

type CartItem = {
    id: number
    quantity: number
}

type ShoppinCartContext = {
    toggleCartVisibility: () => void
    getItemQuantity: (id: number) => number
    increaseCartQuantity: (id: number) => void
    decreaseCartQuantity: (id: number) => void
    removeFromCart: (id: number) => void
    cartQuantity: number
    cartItems: CartItem[]
}

const ShoppingCartContext = createContext({} as ShoppinCartContext)

export function useShoppingCart() {
    return useContext(ShoppingCartContext)
}

export function ShoppingCartProvider({ children }: ShoppingCartProviderProps) {
    const [isOpen, setIsOpen] = useState(false)
    const [cartItems, setCartItems] = useState<CartItem[]>([])

    const cartQuantity = cartItems.reduce((quantity, item) => item.quantity + quantity, 0)

    const toggleCartVisibility = () => setIsOpen(!isOpen);

    function getItemQuantity(id: number) {
        return cartItems.find(item => item.id === id)?.quantity || 0
    }

    function decreaseCartQuantity(id: number) {
        setCartItems(currItems => {
            if (currItems.find(item => item.id === id)?.quantity === 1) {
                return currItems.filter(item => item.id !== id)
            } else {
                return currItems.map(item => {
                    if (item.id == id) {
                        return { ...item, quantity: item.quantity - 1 }
                    } else {
                        return item
                    }
                })
            }
        })
    }
    function increaseCartQuantity(id: number) {
        setCartItems(currItems => {
            if (currItems.find(item => item.id === id) == null) {
                return [...currItems, { id, quantity: 1 }]
            } else {
                return currItems.map(item => {
                    if (item.id == id) {
                        return { ...item, quantity: item.quantity + 1 }
                    } else {
                        return item
                    }
                })
            }
        })
    }

    function removeFromCart(id: number) {
        setCartItems(currItems => {
            return currItems.filter(item => item.id !== id)
        })
    }


    return <ShoppingCartContext.Provider value={{
        getItemQuantity,
        decreaseCartQuantity,
        increaseCartQuantity,
        removeFromCart,
        toggleCartVisibility,
        cartItems,
        cartQuantity
    }}>
        {children}
        <ShoppingCart isOpen={isOpen} />
    </ShoppingCartContext.Provider>
}