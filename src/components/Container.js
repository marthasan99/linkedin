import React from "react";

const Container = ({ className, children }) => {
  return (
    <div className={` mx-auto max-w-[1180px]  p-2.5 ${className} `}>
      {children}
    </div>
  );
};

export default Container;
