import clsx from "clsx";
import { motion } from "framer-motion";
import React from "react";

export default function Card({ children }) {
    return (
        <motion.div
            className={clsx(
                "bg-white rounded border border-gray-300 p-8 shadow-lg z-20 max-h-full relative"
            )}
        >
            {children}
        </motion.div>
    );
}
