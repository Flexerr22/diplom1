import { Footer } from '../../components/Footer/Footer'
import Header from '../../components/Header/Header'
import Users from '../../components/Users/Users'
import '../../App.css'
import { MenuComponent } from '../../MenuComponents/menu-component'



function ProjectPage() {
  
  return (
    <>
      <Header />
      <main>
        <Users />
        <MenuComponent />
      </main>
      <Footer />
    </>
  )
}

export default ProjectPage
