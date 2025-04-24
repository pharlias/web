"use client"

import { Background, Column, Fade, IconButton } from '@/ui/components'
import { ScrollToTop } from '@/ui/components/ScrollToTop'
import React from 'react'

export default function page() {
  return (
    <Column fillWidth paddingY="80" paddingX="s" horizontal="center" flex={1}>
      <ScrollToTop>
        <IconButton variant="secondary" icon="chevronUp" />
      </ScrollToTop>
      <Fade
        zIndex={3}
        pattern={{
          display: true,
          size: "4",
        }}
        position="fixed"
        top="0"
        left="0"
        to="bottom"
        height={5}
        fillWidth
        blur={0.25}
      />
      <Column
        overflow="hidden"
        as="main"
        maxWidth="l"
        position="relative"
        radius="xl"
        horizontal="center"
        border="neutral-alpha-weak"
        fillWidth
      >
      <Background
        mask={{
          x: 0,
          y: 48,
        }}
        position="absolute"
        grid={{
          display: true,
          width: "0.25rem",
          color: "neutral-alpha-medium",
          height: "0.25rem",
        }}
      />
      <Background
        mask={{
          x: 80,
          y: 0,
          radius: 100,
        }}
        position="absolute"
        gradient={{
          display: true,
          tilt: -35,
          height: 50,
          width: 75,
          x: 100,
          y: 40,
          colorStart: "accent-solid-medium",
          colorEnd: "static-transparent",
        }}
      />
      <Background
        mask={{
          x: 100,
          y: 0,
          radius: 100,
        }}
        position="absolute"
        gradient={{
          display: true,
          opacity: 100,
          tilt: -35,
          height: 20,
          width: 120,
          x: 120,
          y: 35,
          colorStart: "brand-solid-strong",
          colorEnd: "static-transparent",
        }}
      />
        Dashboard
      </Column>
    </Column>
  )
}
