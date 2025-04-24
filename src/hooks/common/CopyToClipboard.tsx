import React, { useState } from 'react';
import { IconButton } from '@/ui/components';
import { TooltipCustom } from '@/components/tooltip/tooltip-custom';

interface CopyToClipboardProps {
  text: string;
  tooltipText?: string;
  copiedText?: string;
  size?: 's' | 'm' | 'l';
}

export const CopyToClipboard = ({ 
  text, 
  tooltipText = "Copy to clipboard",
  copiedText = "Copied!",
  size = 's'
}: CopyToClipboardProps) => {
  const [isCopied, setIsCopied] = useState(false);
  
  const handleCopy = () => {
    navigator.clipboard.writeText(text).then(() => {
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    });
  };
  
  return (
    <TooltipCustom
      content={isCopied ? copiedText : tooltipText}
      position="top"
    >
      <IconButton
        icon={isCopied ? "check" : "copy"}
        variant="ghost"
        size={size}
        onClick={handleCopy}
        color={isCopied ? "success-strong" : undefined}
      />
    </TooltipCustom>
  );
};