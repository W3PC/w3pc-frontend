import React, { useState } from 'react'
import { Menu, Burger } from '@mantine/core'
import { Cash, PlayCard, Spade } from 'tabler-icons-react'
import { useHistory } from 'react-router-dom'

const MobileMenu = ({ navigate }) => {
  const history = useHistory()

  const [opened, setOpened] = useState(false)

  const changePage = (e, page) => {
    e.preventDefault()
    setOpened(false)
    navigate(page)
  }

  return (
    <Menu
      opened={opened}
      control={<Burger opened={opened} onClick={() => setOpened(!opened)} />}
      closeOnItemClick
    >
      <Menu.Label>Go To</Menu.Label>
      <Menu.Item
        icon={<Cash size={22} />}
        onClick={(e) => changePage(e, '/')}
        disabled={history.location.pathname === '/'}
      >
        Cashier
      </Menu.Item>
      <Menu.Item
        icon={<PlayCard size={22} />}
        onClick={(e) => changePage(e, '/join')}
        disabled={history.location.pathname === '/join'}
      >
        Join Game
      </Menu.Item>
      <Menu.Item
        icon={<Spade size={22} />}
        onClick={(e) => changePage(e, '/host')}
        disabled={history.location.pathname === '/host'}
      >
        Host Game
      </Menu.Item>
    </Menu>
  )
}

export default MobileMenu
