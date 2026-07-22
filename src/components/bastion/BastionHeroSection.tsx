import * as React from "react";
import type { SVGProps } from "react";
import { motion } from "framer-motion";

const SvgBastionHeroSection = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    id="Bastion_Hero_Section_svg__Layer_1"
    viewBox="-373 0 2600 363.3"
    {...props}
  >
    <defs>
      <clipPath id="Bastion_Hero_Section_svg__clippath">
        <path
          d="M1607.5 326.6h-58.8c-6.1 0-11.1-5-11.1-11.1s5-11.1 11.1-11.1h58.8c6.1 0 11.1 5 11.1 11.1s-5 11.1-11.1 11.1ZM1548.7 304.8c-5.9 0-10.6 4.8-10.6 10.6s4.8 10.6 10.6 10.6h58.8c5.9 0 10.6-4.8 10.6-10.6s-4.8-10.6-10.6-10.6h-58.8Z"
          fill="#fff"
        />
      </clipPath>
      <style>
        {
          ".Bastion_Hero_Section_svg__st0{font-size:14.3px;font-family:Sk-Modernist-Regular,Sk-Modernist,sans-serif}.Bastion_Hero_Section_svg__st0,.Bastion_Hero_Section_svg__st2{fill:#fff}.Bastion_Hero_Section_svg__st3{fill:none;stroke:#fff;stroke-miterlimit:10}.Bastion_Hero_Section_svg__st4{isolation:isolate}"
        }
      </style>
    </defs>
    <motion.g
      initial={{ opacity: 0, scale: 0.8, filter: 'blur(10px)' }}
      animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
      transition={{ duration: 3, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
      style={{ transformOrigin: '800px 300px' }}
    >
      <text
        style={{
          fontFamily: "Sk-Modernist-Regular, Sk-Modernist, sans-serif",
          fill: "#fff",
          fontSize: "367.4px",
        }}
        transform="translate(188.8 326.7)"
      >
        <tspan x={0} y={0}>
          {"Bastion"}
        </tspan>
      </text>
    </motion.g>

    {/* New Bastion Icon Paths from Bastion_2_copy.svg */}
    <g>
      <path
        d="M37.4 326.7l65.9-109.2c19.9-33 33-40.7 83.5-40.7h58.1v149.9h-30.2v-120.7c-75.8 0-72.5-2.2-95.9 36.5l-48.8 84.2H37.4Z"
        fill="#fff"
      />
      <path
        d="M171.8 295.5v31.1h-54.2l5.3-10.1c3.9-6.9 7.1-13.3 12.8-16.2 0 0 6.6-4.6 18.1-4.6h18.3l-.2-.2Z"
        fill="#fff"
      />
    </g>
    <path
      d="M45.2 74.6l54.9 90.9c16.6 27.4 27.4 33.9 69.5 33.9h70s0-124.8 0-124.8h-25.1s0 100.5 0 100.5c-63.1 0-72 1.8-91.4-30.3l-40.6-70.1H45.2Z"
      fill="#fff"
    />

    {/* Right Column Metadata Info */}
    <g>
      <path fill="#fff" d="M1541.1 89.3v-4.3l-3.4-5.9h.9l2.9 5 2.9-5h.9l-3.4 5.9v4.3h-.8Z"/>
      <path fill="#fff" d="M1548.9 89.5c-.8 0-1.4-.2-1.9-.5-.5-.3-.9-.8-1.2-1.4-.3-.6-.4-1.3-.4-2.1s.1-1.5.4-2.1c.3-.6.7-1.1 1.2-1.4s1.2-.5 1.9-.5 1.4.2 2 .5c.5.3.9.8 1.2 1.4s.4 1.3.4 2.1-.1 1.5-.4 2.1c-.3.6-.7 1.1-1.2 1.4-.5.3-1.2.5-1.9.5ZM1548.9 88.7c.9 0 1.6-.3 2-.9.5-.6.7-1.4.7-2.4s-.2-1.8-.7-2.4c-.5-.6-1.1-.9-2-.9s-1.1.1-1.5.4-.7.7-.9 1.1c-.2.5-.3 1.1-.3 1.7 0 1 .2 1.8.7 2.4s1.1.9 2 .9Z"/>
      <path fill="#fff" d="M1557.6 89.5c-.4 0-.8 0-1.1-.2-.3-.1-.6-.3-.9-.5-.2-.2-.5-.5-.6-.8-.2-.3-.3-.6-.4-1 0-.4-.1-.8-.1-1.1v-4.2h.8v4c0 .5 0 .9.1 1.3 0 .4.2.7.4 1 .2.3.4.5.7.6.3.1.6.2 1.1.2s.8 0 1.1-.2c.3-.1.6-.3.8-.6s.3-.6.4-.9.1-.8.1-1.2h.6c0 .9-.1 1.6-.4 2.1s-.7.9-1.1 1.2c-.5.3-1 .4-1.6.4ZM1560.2 89.3v-1.7h0v-6h.8v7.7h-.8Z"/>
      <path fill="#fff" d="M1569.2 89.5c-.6 0-1.1-.1-1.5-.3-.4-.2-.7-.5-.9-.8-.2-.3-.3-.7-.3-1.1s0-.8.3-1.1.4-.5.7-.7.6-.3 1-.4c.4 0 .9-.2 1.4-.2.5 0 1-.1 1.4-.2.4 0 .8 0 1.1-.1l-.3.2c0-.8-.1-1.5-.5-1.9-.3-.4-.9-.6-1.7-.6s-1.1.1-1.4.4c-.4.3-.6.7-.8 1.2l-.8-.2c.2-.7.5-1.2 1.1-1.6.5-.4 1.2-.6 2-.6s1.3.1 1.8.4c.5.3.8.7 1 1.2 0 .2.1.4.2.7 0 .3 0 .5 0 .8v4.8h-.8v-2h.3c-.2.8-.6 1.3-1.2 1.7-.6.4-1.3.6-2.1.6ZM1569.2 88.8c.5 0 1 0 1.4-.3.4-.2.7-.5 1-.8.2-.3.4-.7.5-1.2 0-.3 0-.5 0-.8s0-.5 0-.7l.4.2c-.3 0-.7 0-1.1.1-.4 0-.9 0-1.3.2-.4 0-.9.1-1.2.2-.2 0-.4.2-.7.3-.2.1-.4.3-.6.5-.1.2-.2.5-.2.8s0 .5.2.7c.1.2.3.4.6.6.3.2.6.2 1.1.2Z"/>
      <path fill="#fff" d="M1575.3 89.3v-7.7h.8v1.8l-.2-.2c0-.2.2-.4.3-.6.1-.2.3-.3.4-.5.2-.2.4-.3.7-.4.3 0 .6-.2.8-.2.3 0 .5 0 .8 0v.8c-.3 0-.6 0-1 0s-.7.2-1 .4c-.3.2-.5.5-.6.8-.1.3-.2.6-.2.9 0 .3 0 .7 0 1v3.8h-.8Z"/>
      <path fill="#fff" d="M1583.7 89.5c-.7 0-1.4-.2-1.9-.5-.5-.3-1-.8-1.2-1.4-.3-.6-.4-1.3-.4-2.2s.1-1.6.4-2.2.7-1.1 1.2-1.4 1.2-.5 1.9-.5 1.4.2 1.9.5c.5.3.9.8 1.2 1.5.3.6.4 1.4.4 2.3h-.9v-.3c0-1.1-.3-1.9-.7-2.4s-1.1-.8-1.9-.8-1.5.3-2 .9-.7 1.4-.7 2.4.2 1.8.7 2.4c.5.6 1.1.9 2 .9s1.1-.1 1.6-.4c.4-.3.8-.7 1.1-1.2l.7.3c-.3.7-.8 1.2-1.3 1.5s-1.3.5-2 .5ZM1580.6 85.7v-.7h6.1v.7h-6.1Z"/>
    </g>
    <line className="Bastion_Hero_Section_svg__st3" x1="1517.6" y1="76.5" x2="1517.6" y2="121.4"/>
    <line className="Bastion_Hero_Section_svg__st3" x1="1517.6" y1="145.6" x2="1517.6" y2="190.6"/>
    <line className="Bastion_Hero_Section_svg__st3" x1="1517.4" y1="214.7" x2="1517.4" y2="259.7"/>
    <line className="Bastion_Hero_Section_svg__st3" x1="1517.4" y1="281.9" x2="1517.4" y2="326.9"/>
  </svg>
);
export default SvgBastionHeroSection;
