"use client";

import { Flex, Icon } from "@/ui/components";
import { IconName } from "@/ui/icons";
import classNames from "classnames";
import type React from "react";
import { type ReactNode, forwardRef, useState, useRef, useEffect } from "react";

type Position = "top" | "bottom" | "left" | "right";

type TooltipCustomProps = {
  content: ReactNode;
  children: React.ReactElement;
  prefixIcon?: IconName;
  suffixIcon?: IconName;
  className?: string;
  style?: React.CSSProperties;
  position?: Position;
  show?: boolean;
  hideOnClick?: boolean;
  delay?: number;
  offset?: number;
};

const calculatePosition = (
  triggerRect: DOMRect,
  tooltipRect: DOMRect,
  position: Position,
  offset: number
): React.CSSProperties => {
  const styles: React.CSSProperties = {};
  
  switch (position) {
    case "top":
      styles.left = triggerRect.left + (triggerRect.width / 2) - (tooltipRect.width / 2);
      styles.top = triggerRect.top - tooltipRect.height - offset;
      break;
    case "bottom":
      styles.left = triggerRect.left + (triggerRect.width / 2) - (tooltipRect.width / 2);
      styles.top = triggerRect.bottom + offset;
      break;
    case "left":
      styles.left = triggerRect.left - tooltipRect.width - offset;
      styles.top = triggerRect.top + (triggerRect.height / 2) - (tooltipRect.height / 2);
      break;
    case "right":
      styles.left = triggerRect.right + offset;
      styles.top = triggerRect.top + (triggerRect.height / 2) - (tooltipRect.height / 2);
      break;
  }
  
  return styles;
};

const TooltipCustom = forwardRef<HTMLDivElement, TooltipCustomProps>(
  ({ 
    content, 
    children, 
    prefixIcon, 
    suffixIcon, 
    className, 
    style,
    position = "top",
    show: controlledShow,
    hideOnClick = false,
    delay = 300,
    offset = 8
  }, _) => {
    const [isVisible, setIsVisible] = useState(false);
    const [positionStyles, setPositionStyles] = useState<React.CSSProperties>({});
    const triggerRef = useRef<HTMLDivElement>(null);
    const tooltipRef = useRef<HTMLDivElement>(null);
    const show = controlledShow !== undefined ? controlledShow : isVisible;
    const timeoutRef = useRef<NodeJS.Timeout | null>(null);
    
    const handleMouseEnter = () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      timeoutRef.current = setTimeout(() => {
        setIsVisible(true);
        updatePosition();
      }, delay);
    };
    
    const handleMouseLeave = () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      timeoutRef.current = setTimeout(() => {
        setIsVisible(false);
      }, 100);
    };
    
    const handleClick = () => {
      if (hideOnClick) {
        setIsVisible(false);
      }
    };
    
    const updatePosition = () => {
      if (!triggerRef.current || !tooltipRef.current) return;
      
      const triggerRect = triggerRef.current.getBoundingClientRect();
      const tooltipRect = tooltipRef.current.getBoundingClientRect();
      
      setPositionStyles(calculatePosition(triggerRect, tooltipRect, position, offset));
    };
    
    useEffect(() => {
      if (show) {
        window.addEventListener('resize', updatePosition);
        window.addEventListener('scroll', updatePosition);
        
        // Small delay to ensure tooltip is rendered before measuring
        const positionTimeout = setTimeout(updatePosition, 10);
        
        return () => {
          window.removeEventListener('resize', updatePosition);
          window.removeEventListener('scroll', updatePosition);
          clearTimeout(positionTimeout);
        };
      }
    }, [show]);
    
    // Clean up any timeouts on unmount
    useEffect(() => {
      return () => {
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
        }
      };
    }, []);
    
    return (
      <>
        <Flex
          ref={triggerRef}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          onClick={handleClick}
          style={{ display: 'inline-flex' }}
        >
          {children}
        </Flex>
        
        {show && (
          <Flex
            hide="m"
            ref={tooltipRef}
            style={{
              whiteSpace: "nowrap",
              userSelect: "none",
              position: "fixed",
              zIndex: 9999,
              ...positionStyles,
              ...style,
            }}
            vertical="center"
            gap="4"
            zIndex={1}
            background="surface"
            paddingY="4"
            paddingX="8"
            radius="s"
            border="neutral-medium"
            role="tooltip"
            className={classNames("tooltip", className)}
            data-position={position}
          >
            {prefixIcon && <Icon name={prefixIcon} size="xs" />}
            <Flex
              paddingX="2"
              vertical="center"
              textVariant="body-default-xs"
              onBackground="neutral-strong"
            >
              {content}
            </Flex>
            {suffixIcon && <Icon name={suffixIcon} size="xs" />}
          </Flex>
        )}
      </>
    );
  },
);

TooltipCustom.displayName = "TooltipCustom";

export { TooltipCustom };