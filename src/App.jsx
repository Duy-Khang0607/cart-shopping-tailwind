import { useEffect, useRef, useState } from "react";
import "./App.css";
import CartItems from "./components/CartItems";
import data from "../data.json";

function App() {
  const [isTab, setTab] = useState(false);
  const [cartItems, setCartItems] = useState(() => {
    const cart = localStorage.getItem("cartItems");
    return cart ? JSON.parse(cart) : [];
  });
  const [deletingItemId, setDeletingItemId] = useState(null);
  const [tossingItem, setTossingItem] = useState(null);
  const cartRef = useRef(null);



  const handleTab = () => {
    setTab(!isTab);
  };

  const addToCarts = (item) => {
    setTossingItem(item.id);
    if (cartRef.current) {
      const cartRect = cartRef.current.getBoundingClientRect();
      document.documentElement.style.setProperty('--cart-x', `${cartRect.left - 100}px`);
      document.documentElement.style.setProperty('--cart-y', `${cartRect.top - 150}px`);
    }


    setTimeout(() => {
      setTossingItem(null); // Remove the toss animation after animation ends
      setCartItems((prevItems) => {
        const existingItemIndex = prevItems.findIndex(
          (cartItem) => cartItem.id === item.id
        );

        if (existingItemIndex !== -1) {
          const updatedItems = prevItems.map((cartItem, index) => {
            if (index === existingItemIndex) {
              return {
                ...cartItem,
                quantity: cartItem.quantity + 1,
              };
            }
            return cartItem;
          });
          return updatedItems;
        } else {
          return [...prevItems, { ...item, quantity: 1 }];
        }
      });
    }, 300);

    // setCartItems((prevItems) => {
    //   const existingItemIndex = prevItems.findIndex(
    //     (cartItem) => cartItem.id === item.id
    //   );

    //   if (existingItemIndex !== -1) {
    //     const updatedItems = prevItems.map((cartItem, index) => {
    //       if (index === existingItemIndex) {
    //         return {
    //           ...cartItem,
    //           quantity: cartItem.quantity + 1,
    //         };
    //       }
    //       return cartItem;
    //     });
    //     return updatedItems;
    //   } else {
    //     return [...prevItems, { ...item, quantity: 1 }];
    //   }
    // });
  };

  const handleDeleteCarts = (item) => {
    setDeletingItemId(item.id);
    setTimeout(() => {
      setCartItems((prevItems) =>
        prevItems.filter((cartItem) => cartItem.id !== item.id)
      );
      setDeletingItemId(null);
    }, 300);
  };

  const handleTotalPrice = cartItems?.reduce(
    (total, item) => total + item?.price * item?.quantity,
    0
  );

  const saveCartToLocalStorage = () => {
    if (cartItems.length > 0) {
      localStorage.setItem("cartItems", JSON.stringify(cartItems));
    } else {
      localStorage.removeItem("cartItems");
    }
  };

  const totalQuantity = () => {
    const total = cartItems.reduce((total, item) => total + item?.quantity, 0);
    console.log({ total });
    return total;
  };

  const incrementQuantity = (id) => {
    setCartItems((prevItems) =>
      prevItems.map((item) =>
        item.id === id ? { ...item, quantity: item.quantity + 1 } : item
      )
    );
  };

  const decrementQuantity = (id) => {
    setCartItems((prevItems) =>
      prevItems.map((item) =>
        item.id === id && item.quantity > 1
          ? { ...item, quantity: item.quantity - 1 }
          : item
      )
    );
  };

  useEffect(() => {
    saveCartToLocalStorage();
  }, [cartItems]);

  return (
    <>
      <section
        className={
          isTab
            ? `backdrop-blur-3xl blur-sm -translate-x-48 transistion-all ease-in-out duration-500`
            : `relative h-full w-full translate-x-0 transistion-all ease-in-out duration-500`
        }
        style={{ pointerEvents: isTab ? "none" : "auto" }}
      >
        <div className="max-w-screen-xl mx-auto p-2 bg-neutral-50">
          <h1 className="text-2xl font-bold text-black text-left">Tea shirt</h1>
          {/* Items */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:p-10">
            {data?.map((item, index) => {
              return (
                // <>
                //   <CartItems
                //     key={index}
                //     item={item}
                //     addToCarts={addToCarts}
                //   />
                // </>
                <div className="img-container" key={index}>
                  {tossingItem === item.id && (
                    <img
                      src={item.image.desktop}
                      className="fly-to-cart"
                      alt="Flying img"
                      style={{ width: "100px", height: "100px" }} // Adjust size as needed
                    />
                  )}
                  <CartItems item={item} addToCarts={addToCarts} />
                </div>
              );
            })}
          </div>
        </div>
      </section>
      {/* Menu bar */}
      <div className="fixed top-0 right-0">
        {isTab ? (
          ""
        ) : (
          <button
            className="cursor-pointer w-12 h-12 flex justify-center items-center relative shadow-sm bg-non transition-all duration-200 ease-in-out"
            onClick={handleTab}
          >
            <i className="fa fa-cart-plus text-lg z-50"></i>
            <span className="absolute top-0 right-0 bg-red-500 text-white w-5 h-5 rounded-full">
              <p className="text-sm font-bold">{totalQuantity()}</p>
            </span>
          </button>
        )}
        {isTab && (
          <div className="relative top-0 right-0 h-screen max-w-[1000px] bg-black bg-opacity-90 text-white shadow-lg rounded-lg transition-all duration-500 ease-in-out overflow-hidden">
            <h2 className="text-2xl font-bold mb-4 text-center">
              Shopping Cart
            </h2>
            <button
              onClick={handleTab}
              className="w-6 h-6 flex justify-center items-center rounded bg-red-600 absolute top-2 right-2 hover:bg-white transition-all duration-200 hover:text-red-600 font-bold"
            >
              X
            </button>
            <div className="max-h-[calc(100vh-200px)] overflow-y-auto overflow-x-hidden">
              <table className="w-full table-auto border-collapse">
                <thead className="text-sm sticky top-0 bg-black w-full">
                  <tr className="text-center border-b w-full border-gray-700">
                    <th className="py-2 px-4 min-w-[100px]">Mã sản phẩm</th>
                    <th className="py-2 px-4 min-w-[100px]">Sản phẩm</th>
                    <th className="py-2 px-4 min-w-[100px]">Hình ảnh</th>
                    <th className="py-2 px-4 min-w-[100px]">Giá</th>
                    <th className="py-2 px-4 min-w-[100px]">Số lượng</th>
                    <th className="py-2 px-4 ">
                      <i className="fa fa-trash"></i>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {cartItems?.map((item, index) => {
                    return (
                      <tr
                        key={index}
                        className={`hover:bg-gray-800 text-center ${
                          deletingItemId === item.id
                            ? "jump-out transition-all ease-linear duration-200"
                            : ""
                        }`}
                      >
                        <td className="py-3 px-4">{+index + 1}</td>
                        <td className="py-3 px-4 text-sm text-left">
                          {item.name}
                        </td>
                        <td className="py-3 px-4">
                          <img
                            src={item.image.desktop}
                            className="w-full h-14 object-cover rounded-sm shadow-md shadow-neutral-500"
                            alt="img"
                          />
                        </td>
                        <td className="py-3 px-4">{+item.price}$</td>
                        <td className="py-3 px-4">
                          <div className="flex flex-row justify-center gap-2 items-center">
                            <button
                              onClick={() => decrementQuantity(item?.id)}
                              className="h-5 w-5 bg-white text-black rounded-full font-bold flex justify-center items-center transition-all duration-200 hover:bg-black hover:text-white"
                            >
                              -
                            </button>
                            <span>{item?.quantity}</span>
                            <button
                              onClick={() => incrementQuantity(item?.id)}
                              className="h-5 w-5 bg-white text-black rounded-full font-bold flex justify-center items-center transition-all duration-200 hover:bg-black hover:text-white"
                            >
                              +
                            </button>
                          </div>
                        </td>
                        <td
                          onClick={() => handleDeleteCarts(item)}
                          className="py-3 px-4 cursor-pointer"
                        >
                          <button className="w-5 h-5 bg-red-600 rounded hover:bg-white hover:text-red-600 transition-all duration-200 font-bold text-center">
                            X
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            {/* Total price */}
            <div className="absolute z-50 bottom-2 left-0 right-0 flex flex-col">
              <div className="flex justify-between items-center px-4 mt-auto">
                <h3 className="text-xl font-semibold">Tổng tiền:</h3>
                <h3 className="text-xl font-semibold">{handleTotalPrice}$</h3>
              </div>
              <button className="bg-green-500 text-white font-semibold py-2 px-4 mt-4 rounded-md hover:bg-green-400 transition-all duration-200 mx-4">
                Thanh toán
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

export default App;
