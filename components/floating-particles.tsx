import { motion } from "framer-motion";

// Add this function after the renderMiniChart function
const FloatingParticle = ({ size, color, delay, duration, left }) => {
  return (
    <motion.div
      className={`absolute rounded-full ${color} opacity-20 pointer-events-none`}
      style={{
        width: size,
        height: size,
        left: `${left}%`,
      }}
      initial={{ y: "110vh", opacity: 0 }}
      animate={{
        y: "-10vh",
        opacity: [0, 0.2, 0.1, 0.2, 0],
        x: [0, 10, -10, 15, -5, 0],
      }}
      transition={{
        duration: duration,
        delay: delay,
        repeat: Number.POSITIVE_INFINITY,
        repeatType: "loop",
      }}
    />
  );
};

// Add this component after the FloatingParticle component
export const BackgroundParticles = () => {
  return (
    <div className="absolute inset-0 overflow-hidden z-0 opacity-40">
      <FloatingParticle
        size="20px"
        color="bg-pink-400"
        delay={0}
        duration={15}
        left={10}
      />
      <FloatingParticle
        size="30px"
        color="bg-pink-500"
        delay={2}
        duration={20}
        left={20}
      />
      <FloatingParticle
        size="15px"
        color="bg-pink-300"
        delay={5}
        duration={18}
        left={30}
      />
      <FloatingParticle
        size="25px"
        color="bg-pink-600"
        delay={7}
        duration={25}
        left={40}
      />
      <FloatingParticle
        size="18px"
        color="bg-pink-400"
        delay={10}
        duration={22}
        left={50}
      />
      <FloatingParticle
        size="22px"
        color="bg-pink-500"
        delay={3}
        duration={19}
        left={60}
      />
      <FloatingParticle
        size="28px"
        color="bg-pink-300"
        delay={8}
        duration={23}
        left={70}
      />
      <FloatingParticle
        size="16px"
        color="bg-pink-600"
        delay={12}
        duration={17}
        left={80}
      />
      <FloatingParticle
        size="24px"
        color="bg-pink-400"
        delay={6}
        duration={21}
        left={90}
      />
    </div>
  );
};
