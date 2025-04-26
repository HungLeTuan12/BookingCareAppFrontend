import { motion } from "framer-motion";
import PropTypes from "prop-types";
import React from "react";

const AnimatedPageWrapper = ({ children, className }) => {
  // Animation variants for sections
  const sectionVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (delay = 0) => ({
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, delay, ease: "easeOut" },
    }),
  };

  // Animation variants for child elements (e.g., cards, images)
  const childVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (index = 0) => ({
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, delay: 0.4 + index * 0.1, ease: "easeOut" },
    }),
  };

  // Animation variants for images (zoom-in effect)
  const imageVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: (index = 0) => ({
      opacity: 1,
      scale: 1,
      transition: { duration: 0.5, delay: 0.4 + index * 0.1, ease: "easeOut" },
    }),
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.7 }}
      className={className}
    >
      {React.Children.map(children, (child, index) => {
        // Check if the child is a section (e.g., a div with a specific class or structure)
        if (child.props.className?.includes("section")) {
          return (
            <motion.div
              custom={index * 0.2} // Delay based on section index
              initial="hidden"
              animate="visible"
              variants={sectionVariants}
              className={child.props.className}
            >
              {child.props.children}
            </motion.div>
          );
        }
        return child; // Return non-section elements as-is (e.g., Header, Footer)
      })}
    </motion.div>
  );
};

AnimatedPageWrapper.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
};

export default AnimatedPageWrapper;

// Export the variants for use in child components (e.g., cards, images)
export const childVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (index = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, delay: 0.4 + index * 0.1, ease: "easeOut" },
  }),
};

export const imageVariants = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: (index = 0) => ({
    opacity: 1,
    scale: 1,
    transition: { duration: 0.5, delay: 0.4 + index * 0.1, ease: "easeOut" },
  }),
};
