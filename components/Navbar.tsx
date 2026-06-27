import Link from "next/link"
import Image from "next/image"

const Navbar = () => {
  return (
    <header>
        <nav>
            <Link href='/' className="logo">
                <Image src="/icons/logo.png" width={24} height={24} alt="logo"/>
                <p>DevQuest</p>
            </Link>

            <ul>
                <Link href="/">Home</Link>
                <Link href="/#events">Events</Link>
                <Link href="/create-event">Create Event</Link>
            </ul>
        </nav>
    </header>
  )
}

export default Navbar