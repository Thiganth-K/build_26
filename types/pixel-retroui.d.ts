declare module "pixel-retroui" {
  import React, {
    ReactNode,
    ButtonHTMLAttributes,
    HTMLAttributes,
    InputHTMLAttributes,
    TextareaHTMLAttributes,
  } from "react";

  export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    children?: ReactNode;
    className?: string;
    bg?: string;
    textColor?: string;
    shadow?: string;
    borderColor?: string;
  }

  export interface CardProps extends HTMLAttributes<HTMLDivElement> {
    children?: ReactNode;
    className?: string;
    bg?: string;
    textColor?: string;
    borderColor?: string;
    shadowColor?: string;
    style?: React.CSSProperties;
  }

  export interface ProgressBarProps {
    progress: number;
    className?: string;
    size?: "sm" | "md" | "lg";
    color?: string;
    borderColor?: string;
  }

  export interface BubbleProps extends HTMLAttributes<HTMLDivElement> {
    children?: ReactNode;
    className?: string;
    direction?: "left" | "right" | "top" | "bottom";
    bg?: string;
    borderColor?: string;
    textColor?: string;
  }

  export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
    bg?: string;
    textColor?: string;
    borderColor?: string;
    shadowColor?: string;
  }

  export interface TextAreaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
    bg?: string;
    textColor?: string;
    borderColor?: string;
    shadowColor?: string;
  }

  export interface PopupProps extends HTMLAttributes<HTMLDivElement> {
    isOpen: boolean;
    onClose?: () => void;
    children?: ReactNode;
    bg?: string;
    borderColor?: string;
    shadowColor?: string;
  }

  export interface AccordionProps {
    title: ReactNode;
    children: ReactNode;
    className?: string;
    bg?: string;
    borderColor?: string;
    shadowColor?: string;
  }

  export const Button: React.FC<ButtonProps>;
  export const Card: React.FC<CardProps>;
  export const ProgressBar: React.FC<ProgressBarProps>;
  export const Bubble: React.FC<BubbleProps>;
  export const Input: React.FC<InputProps>;
  export const TextArea: React.FC<TextAreaProps>;
  export const Popup: React.FC<PopupProps>;
  export const Accordion: React.FC<AccordionProps>;
  export const Dropdown: any;
}
