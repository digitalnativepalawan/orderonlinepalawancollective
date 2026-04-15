import { Sun, Moon, ShoppingCart, Lock, LogOut, Menu, X } from "lucide-react";
import { useApp } from "@/context/AppContext";
import { useTheme } from "@/hooks/useTheme";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

// Inline SVG Icons for Social Media (Reliable for builds)
const FacebookIcon = ({ size = 20, className = "" }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor
