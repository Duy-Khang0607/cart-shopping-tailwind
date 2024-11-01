import React from "react";
import "../App.css";

const CartItems = ({ item, addToCarts, animatingItemId,imgRef }) => {
  return (
    <section
      className={`border-2 bg-neutral-100 max-w-[500px] h-full rounded-lg hover:border-gray-500 transition-all duration-200 hover:shadow-md cursor-pointer p-2`}
    >
      <div
        className={`item-image ${animatingItemId === item?.id ? "animate-to-cart" : ""}`}
      >
        <img
          className="w-full h-auto object-cover"
          src={item?.image.desktop}
          alt="img"
          ref={imgRef}
        />
      </div>
      <div className="flex flex-col">
        <div className="pl-2 text-left leading-10">
          <h1 className="text-md font-normal leading-7 h-[30px]">
            {item?.name}
          </h1>
          <p className="text-sm font-normal">Price: {item?.price}$</p>
        </div>
        <button
          onClick={() => addToCarts(item)}
          className="text-black bg-slate-500 shadow-md transition-all duration-300 hover:bg-slate-400 w-full h-[40px] font-bold cursor-pointer"
        >
          Add to cart
        </button>
      </div>
    </section>
  );
};

export default CartItems;
