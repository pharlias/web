"use client"

import { Row, Logo, IconButton, Button, Text, NavIcon, Flex, Column, ToggleButton, Icon } from '@/ui/components'
import { usePathname } from 'next/navigation'
import React, { useRef, useEffect, JSX } from 'react'
import styles from './navbar.module.scss'
import { linksDocs, linksGithub, linksLogo, linksTwitter, routes, routesMobile } from '@/constans/config'
import WalletButtonCustom from './rainbow-kit/wallet-button-custom'
import classNames from 'classnames'

export default function Navbar(): JSX.Element {
  const pathname: string = usePathname()
  const [isOpen, setIsOpen] = React.useState<boolean>(false)
  const [isAnimating, setIsAnimating] = React.useState<boolean>(false)
  const [animationState, setAnimationState] = React.useState<'opening' | 'closing' | null>(null)
  const menuRef = useRef<HTMLDivElement | null>(null)
  const backdropRef = useRef<HTMLDivElement | null>(null)

  const toggleMenu = (): void => {
    if (isOpen) {
      setIsAnimating(true)
      setAnimationState('closing')

      setTimeout(() => {
        setIsOpen(false)
        setIsAnimating(false)
        setAnimationState(null)
      }, 300)
    } else {
      setIsOpen(true)
      setAnimationState('opening')
    }
  }

  const handleLinkClick = (href: string): void => {
    toggleMenu()
    console.log(`Link clicked: ${href}`)
  }

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent): void => {
      if (
        isOpen &&
        menuRef.current &&
        !menuRef.current.contains(event.target as Node) &&
        !(event.target as Element).closest(`.${styles.navIcon}`)
      ) {
        toggleMenu()
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen])

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 900 && isOpen) {
        setIsOpen(false)
        setIsAnimating(false)
        setAnimationState(null)
      }
    }

    window.addEventListener('resize', handleResize)
    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, [isOpen])

  return (
    <Row position="fixed" top="0" fillWidth horizontal="center" zIndex={5}>
      <Row
        data-border="rounded"
        horizontal="space-between"
        maxWidth="l"
        paddingRight="32"
        paddingLeft="32"
        paddingY="20"
        vertical='center'
      >
        <Row gap="12" vertical="center">
          <Logo size="s" icon={true} iconSrc={linksLogo} href={linksLogo} wordmark={false} />
          <Text size="m">Pharlias</Text>
        </Row>
        <Row 
        gap="12" 
        vertical='center'
        hide='m'
        >
          {routes.map((route) => (
            <Button
              key={route.label}
              href={route.href}
              size="s"
              label={route.label}
              weight={pathname.startsWith(route.href) ? "strong" : "default"}
              className={pathname.startsWith(route.href) ? styles.activeButton : ""}
              variant="tertiary"
            />
          ))}
          <IconButton
            href={linksDocs}
            icon="book"
            variant="tertiary"
          />
          <IconButton
            href={linksTwitter}
            icon="twitter"
            variant="tertiary"
          />
          <IconButton
            href={linksGithub}
            icon="github"
            variant="tertiary"
          />
          <Row horizontal='center' vertical='center' gap="12">
            <WalletButtonCustom />
          </Row>
        </Row>
        <NavIcon
          onClick={toggleMenu}
          isActive={isOpen || isAnimating}
          hide='l'
          show='m'
        />
      </Row>

      {(isOpen || isAnimating) && (
        <div
          ref={backdropRef}
          className={styles.menuBackdrop}
          onClick={toggleMenu}
          style={{
            animation: animationState === 'opening'
              ? `${styles.fadeInBackdrop} 0.3s ease-out forwards`
              : animationState === 'closing'
                ? `${styles.fadeOutBackdrop} 0.3s ease-in forwards`
                : 'none'
          }}
        />
      )}

      {(isOpen || isAnimating) && (
        <Flex
          ref={menuRef}
          position="fixed"
          transition='macro-medium'
          top="80"
          maxWidth={30}
          fillWidth
          right="0"
          direction="column"
          padding="24"
          zIndex={9}
          radius="m-8"
          background="surface"
          border="neutral-medium"
          borderWidth={1}
          vertical='center'
          className={classNames(
            styles.navMenuMobileContainer,
          )}
          style={{
            animation: animationState === 'opening'
              ? `${styles.fadeIn} 0.3s ease-out forwards`
              : animationState === 'closing'
                ? `${styles.fadeOut} 0.3s ease-in forwards`
                : 'none'
          }}
        >
          <Row direction="column" gap="12" className={styles.navMenuMobile}>
            {routesMobile.map((link, idx) => (
              <ToggleButton
                key={`link-${idx}`}
                className={classNames(styles.navLinkMobile, pathname.startsWith(link.href) ? styles.activeButton : "")}
                fillWidth
                justifyContent="start"
                href={link.href}
                onClick={() => handleLinkClick(link.href)}
              >
                {link.description ? (
                  <Row gap="12">
                    {link.icon && (
                      <Icon
                        name={link.icon}
                        size="s"
                        padding="8"
                        radius="s"
                        border="neutral-alpha-weak"
                      />
                    )}
                    <Column gap="4">
                      <Text onBackground="neutral-strong" variant="label-strong-s">
                        {link.label}
                      </Text>
                      <Text onBackground="neutral-weak">{link.description}</Text>
                    </Column>
                  </Row>
                ) : (
                  link.label
                )}
              </ToggleButton>
            ))}
          </Row>
          <Row horizontal='center' gap="12" paddingTop="16">
            <WalletButtonCustom />
          </Row>
          <Row gap="16" horizontal="center" paddingTop="16">
            <IconButton
              href={linksDocs}
              icon="book"
              variant="tertiary"
              size="m"
            />
            <IconButton
              href={linksTwitter}
              icon="twitter"
              variant="tertiary"
              size="m"
            />
            <IconButton
              href={linksGithub}
              icon="github"
              variant="tertiary"
              size="m"
            />
          </Row>
        </Flex>
      )}
    </Row>
  )
}