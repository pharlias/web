import { Flex } from '@/ui/components'
import React from 'react'
import styles from './loading.module.scss'

export default function Loading() {
  return (
    <Flex className={styles.loadingContainer} width={100} height={100}>
      <Flex className={styles.lavaLamp}>
        <Flex className={styles.bubble}></Flex>
        <Flex className={styles.bubble1}></Flex>
        <Flex className={styles.bubble2}></Flex>
        <Flex className={styles.bubble3}></Flex>
      </Flex>
    </Flex>
  )
}