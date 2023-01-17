import React from "react";
import "./toggle.scss";

const Toggle = ({ value, onChange }) => (
   <>
      <input
         id="toggler"
         type="checkbox"
         onClick={onChange}
         checked={value}
         readOnly
      />
      <label
         htmlFor="toggler"
         data-onlabel="dark"
         data-offlabel="light"
         className="lb1"
      />
   </>
);

export default Toggle;
