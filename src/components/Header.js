import React from 'react'
import { Nav, Navbar } from 'react-bootstrap'


const Header = () => {
  return (
    <>
    <Navbar bg="dark" variant="dark">
      <Navbar.Brand href="#home">Navbar</Navbar.Brand>
      <Nav className="me-auto">
        <Nav.Link href="/boc-tham-chia-bang">Bốc thăm chia bảng (Bóng đá)</Nav.Link>
        <Nav.Link href="/boc-tham-chia-nhom">Bốc thăm chia nhóm</Nav.Link>
        <Nav.Link href="#pricing">Pricing</Nav.Link>
      </Nav>
    </Navbar>
    </>
  )
}

export default Header