import { ReactNode, useCallback, useEffect, useRef, useState } from 'react'
import { Link, useLocation } from 'react-router'

// Assume these icons are imported from an icon library
import {
  BoxIcon,
  // BoxCubeIcon,
  // CalenderIcon,
  ChevronDownIcon, ChevronRightIcon,
  GridIcon,
  HorizontaLDots,
  // ListIcon,
  // PageIcon,
  // PieChartIcon,
  TableIcon,
} from '../../../icons/index.ts'
import { useSidebar } from '../../context/SidebarContext.tsx'

type NavItem = {
  name: string;
  icon: React.ReactNode;
  path?: string;
  subItems?: { icon?: ReactNode; name: string; path: string; pro?: boolean; new?: boolean }[];
};

const navItems: NavItem[] = [
  {
    icon: <GridIcon />,
    name: 'Bảng điều khiển',
    path: '/'
  },
  {
    name: 'Sản phẩm',
    icon: <BoxIcon />,
    subItems: [{ name: 'Mã hàng', path: '/products', pro: false }]
  },
  {
    name: 'Danh mục sản phẩm',
    icon: <TableIcon />,
    subItems: [{ icon: <ChevronRightIcon />, name: 'Hệ vân', path: '/patterns', pro: false },
      { icon: <ChevronRightIcon />, name: 'Nhà cung cấp', path: '/suppliers', pro: false },
      { icon: <ChevronRightIcon />, name: 'Nhà máy', path: '/factories', pro: false },
      { icon: <ChevronRightIcon />, name: 'Bề mặt', path: '/surfaces', pro: false },
      { icon: <ChevronRightIcon />, name: 'Chất liệu', path: '/materials', pro: false },
      { icon: <ChevronRightIcon />, name: 'Màu sắc', path: '/colors', pro: false },
      { icon: <ChevronRightIcon />, name: 'Thân gạch', path: '/body-colors', pro: false },
      { icon: <ChevronRightIcon />, name: 'Xuất xứ', path: '/origins', pro: false },
      { icon: <ChevronRightIcon />, name: 'Kích thước', path: '/sizes', pro: false },
      { icon: <ChevronRightIcon />, name: 'Mã công ty', path: '/company-codes', pro: false },
      { icon: <ChevronRightIcon />, name: 'Gia công', path: '/processings', pro: false },
      { icon: <ChevronRightIcon />, name: 'Kho hàng', path: '/storages', pro: false },
      { icon: <ChevronRightIcon />, name: 'Mức độ chống trượt', path: '/anti-slipperys', pro: false },
      { icon: <ChevronRightIcon />, name: 'Mức độ hút nước', path: '/water-absorptions', pro: false },
      { icon: <ChevronRightIcon />, name: 'Đơn vị tính', path: '/calculated-units', pro: false }]
    }
]

const AppSidebar: React.FC = () => {
  const { isExpanded, isMobileOpen, isHovered, setIsHovered } = useSidebar()
  const location = useLocation()

  const [openSubmenu, setOpenSubmenu] = useState<{
    type: 'main';
    index: number;
  } | null>(null)
  const [subMenuHeight, setSubMenuHeight] = useState<Record<string, number>>(
    {}
  )
  const subMenuRefs = useRef<Record<string, HTMLDivElement | null>>({})

  // const isActive = (path: string) => location.pathname === path;
  const isActive = useCallback(
    (path: string) => location.pathname === path,
    [location.pathname]
  )

  useEffect(() => {
    let submenuMatched = false;
    ['main'].forEach((menuType) => {
      const items = menuType === 'main' ? navItems : navItems
      items.forEach((nav, index) => {
        if (nav.subItems) {
          nav.subItems.forEach((subItem) => {
            if (isActive(subItem.path)) {
              setOpenSubmenu({
                type: menuType as 'main',
                index
              })
              submenuMatched = true
            }
          })
        }
      })
    })

    if (!submenuMatched) {
      setOpenSubmenu(null)
    }
  }, [location, isActive])

  useEffect(() => {
    if (openSubmenu !== null) {
      const key = `${openSubmenu.type}-${openSubmenu.index}`
      if (subMenuRefs.current[key]) {
        setSubMenuHeight((prevHeights) => ({
          ...prevHeights,
          [key]: subMenuRefs.current[key]?.scrollHeight || 0
        }))
      }
    }
  }, [openSubmenu])

  const handleSubmenuToggle = (index: number, menuType: 'main') => {
    setOpenSubmenu((prevOpenSubmenu) => {
      if (
        prevOpenSubmenu &&
        prevOpenSubmenu.type === menuType &&
        prevOpenSubmenu.index === index
      ) {
        return null
      }
      return { type: menuType, index }
    })
  }

  const renderMenuItems = (items: NavItem[], menuType: 'main') => (
    <ul className="flex flex-col gap-4">
      {items.map((nav, index) => (
        <li key={nav.name}>
          {nav.subItems ? (
            <button
              onClick={() => handleSubmenuToggle(index, menuType)}
              className={`menu-item group ${
                openSubmenu?.type === menuType && openSubmenu?.index === index
                  ? 'menu-item-active'
                  : 'menu-item-inactive'
              } cursor-pointer ${
                !isExpanded && !isHovered
                  ? 'lg:justify-center'
                  : 'lg:justify-start'
              }`}
            >
              <span
                className={`menu-item-icon-size  ${
                  openSubmenu?.type === menuType && openSubmenu?.index === index
                    ? 'menu-item-icon-active'
                    : 'menu-item-icon-inactive'
                }`}
              >
                {nav.icon}
              </span>
              {(isExpanded || isHovered || isMobileOpen) && (
                <span className="menu-item-text">{nav.name}</span>
              )}
              {(isExpanded || isHovered || isMobileOpen) && (
                <ChevronDownIcon
                  className={`ml-auto w-5 h-5 transition-transform duration-200 ${
                    openSubmenu?.type === menuType &&
                    openSubmenu?.index === index
                      ? 'rotate-180 text-brand-500'
                      : ''
                  }`}
                />
              )}
            </button>
          ) : (
            nav.path && (
              <Link
                to={nav.path}
                className={`menu-item group ${
                  isActive(nav.path) ? 'menu-item-active' : 'menu-item-inactive'
                }`}
              >
                <span
                  className={`menu-item-icon-size ${
                    isActive(nav.path)
                      ? 'menu-item-icon-active'
                      : 'menu-item-icon-inactive'
                  }`}
                >
                  {nav.icon}
                </span>
                {(isExpanded || isHovered || isMobileOpen) && (
                  <span className="menu-item-text">{nav.name}</span>
                )}
              </Link>
            )
          )}
          {nav.subItems && (isExpanded || isHovered || isMobileOpen) && (
            <div
              ref={(el) => {
                subMenuRefs.current[`${menuType}-${index}`] = el
              }}
              className="overflow-hidden transition-all duration-300"
              style={{
                height:
                  openSubmenu?.type === menuType && openSubmenu?.index === index
                    ? `${subMenuHeight[`${menuType}-${index}`]}px`
                    : '0px'
              }}
            >
              <ul className="mt-2 space-y-1 ml-9">
                {nav.subItems.map((subItem) => (
                  <li key={subItem.name}>
                    <Link
                      to={subItem.path}
                      className={`menu-dropdown-item ${
                        isActive(subItem.path)
                          ? 'menu-dropdown-item-active'
                          : 'menu-dropdown-item-inactive'
                      }`}
                    >
                      {subItem.icon}{subItem.name}
                      <span className="flex items-center gap-1 ml-auto">
                        {subItem.new && (
                          <span
                            className={`ml-auto ${
                              isActive(subItem.path)
                                ? 'menu-dropdown-badge-active'
                                : 'menu-dropdown-badge-inactive'
                            } menu-dropdown-badge`}
                          >
                            new
                          </span>
                        )}
                        {subItem.pro && (
                          <span
                            className={`ml-auto ${
                              isActive(subItem.path)
                                ? 'menu-dropdown-badge-active'
                                : 'menu-dropdown-badge-inactive'
                            } menu-dropdown-badge`}
                          >
                            pro
                          </span>
                        )}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </li>
      ))}
    </ul>
  )

  return (
    <aside
      className={`fixed mt-16 flex flex-col lg:mt-0 top-0 px-5 left-0 bg-white dark:bg-gray-900 dark:border-gray-800 text-gray-900 h-screen transition-all duration-300 ease-in-out z-50 border-r border-gray-200 
        ${
        isExpanded || isMobileOpen
          ? 'w-[290px]'
          : isHovered
            ? 'w-[290px]'
            : 'w-[90px]'
      }
        ${isMobileOpen ? 'translate-x-0' : '-translate-x-full'}
        lg:translate-x-0`}
      onMouseEnter={() => !isExpanded && setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div
        className={`py-8 flex ${
          !isExpanded && !isHovered ? 'lg:justify-center' : 'justify-start'
        }`}
      >
        <Link to="/">
          {isExpanded || isHovered || isMobileOpen ? (
            <>
              <img
                className="dark:hidden"
                src="/images/logo/ankhanhhouse_logo.svg"
                alt="Logo"
                width={150}
                height={40}
              />
              <img
                className="hidden dark:block"
                src="/images/logo/ankhanhhouse_logo_dark.svg"
                alt="Logo"
                width={150}
                height={40}
              />
            </>
          ) : (
            <img
              src="/images/logo/ankhanhhouse_logo.svg"
              alt="Logo"
              width={32}
              height={32}
            />
          )}
        </Link>
      </div>
      <div className="flex flex-col overflow-y-auto duration-300 ease-linear no-scrollbar">
        <nav className="mb-6">
          <div className="flex flex-col gap-4">
            <div>
              <h2
                className={`mb-4 text-xs uppercase flex leading-[20px] text-gray-400 ${
                  !isExpanded && !isHovered
                    ? 'lg:justify-center'
                    : 'justify-start'
                }`}
              >
                {isExpanded || isHovered || isMobileOpen ? (
                  'Menu'
                ) : (
                  <HorizontaLDots className="size-6" />
                )}
              </h2>
              {renderMenuItems(navItems, 'main')}
            </div>
          </div>
        </nav>
      </div>
    </aside>
  )
}

export default AppSidebar
