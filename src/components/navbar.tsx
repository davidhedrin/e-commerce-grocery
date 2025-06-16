"use client";

import { Book, LogIn, LogOut, Menu, Settings, ShoppingCart, Sunset, Trees, User, Zap } from "lucide-react";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import Configs from "@/lib/config";
import { UseAlertDialog } from "./alert-confirm";
import { useSession } from "next-auth/react";
import { signOutAuth } from "@/server/auth";
import { toast } from "sonner";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "./ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { getInitials } from "@/lib/utils";
import { useRouter } from "next/navigation";

interface MenuItem {
  title: string;
  url: string;
  description?: string;
  icon?: React.ReactNode;
  items?: MenuItem[];
}

interface NavbarProps {
  menu?: MenuItem[];
}

const Navbar = ({
  menu = [
    { title: "Home", url: "#" },
    {
      title: "Products",
      url: "#",
      items: [
        {
          title: "Blog",
          description: "The latest industry news, updates, and info",
          icon: <Book className="size-5 shrink-0" />,
          url: "#",
        },
        {
          title: "Company",
          description: "Our mission is to innovate and empower the world",
          icon: <Trees className="size-5 shrink-0" />,
          url: "#",
        },
        {
          title: "Careers",
          description: "Browse job listing and discover our workspace",
          icon: <Sunset className="size-5 shrink-0" />,
          url: "#",
        },
        {
          title: "Support",
          description:
            "Get in touch with our support team or visit our community forums",
          icon: <Zap className="size-5 shrink-0" />,
          url: "#",
        },
      ],
    },
    {
      title: "Resources",
      url: "#",
      items: [
        {
          title: "Help Center",
          description: "Get all the answers you need right here",
          icon: <Zap className="size-5 shrink-0" />,
          url: "#",
        },
        {
          title: "Contact Us",
          description: "We are here to help you with any questions you have",
          icon: <Sunset className="size-5 shrink-0" />,
          url: "#",
        },
        {
          title: "Status",
          description: "Check the current status of our services and APIs",
          icon: <Trees className="size-5 shrink-0" />,
          url: "#",
        },
        {
          title: "Terms of Service",
          description: "Our terms and conditions for using our services",
          icon: <Book className="size-5 shrink-0" />,
          url: "#",
        },
      ],
    },
    {
      title: "Pricing",
      url: "#",
    },
    {
      title: "Blog",
      url: "#",
    },
  ]
}: NavbarProps) => {
  const appName = Configs.app_name;
  const session = useSession();
  const { push } = useRouter();
  const { openAlert } = UseAlertDialog();

  const signOutAction = async () => {
    const confirmed = await openAlert({
      title: 'Want to Logout?',
      description: 'Are you sure you want to log out of your account?',
      textConfirm: 'Log Me Out',
      textClose: 'Not Now',
      icon: 'bx bx-log-out bx-tada text-red-500'
    });
    if (!confirmed) return;

    toast.success("Logged Out!", {
      description: "We'll be here when you're ready to log back in.",
    });
    localStorage.clear();
    await signOutAuth();
  };

  return (
    <section className="p-4">
      <div className="container">
        {/* Desktop Menu */}
        <nav className="hidden justify-between lg:flex">
          <div className="flex items-center gap-6">
            {/* Logo */}
            <a href="/" className="flex items-center gap-2 self-center font-medium">
              <div className="px-1 py-0.5 rounded-lg bg-blue-600 text-sidebar-primary-foreground">
                <i className='bx bx-shopping-bag text-2xl'></i>
              </div>
              <div className="text-lg text-blue-600">
                {appName}
              </div>
            </a>
            <div className="flex items-center">
              <NavigationMenu>
                <NavigationMenuList>
                  {menu.map((item) => renderMenuItem(item))}
                </NavigationMenuList>
              </NavigationMenu>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button className="rounded-full cursor-pointer" type="button" variant="ghost" size="sm">
              <i className='bx bx-cart text-2xl'></i>
            </Button>
            {
              (session && session.status == "authenticated") ? (
                <>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Avatar className="h-8 w-8 cursor-pointer border-2 border-ring hover:shadow-md transition">
                        <AvatarImage src="/profile.jpg" alt="User" />
                        <AvatarFallback className="text-sm">{getInitials(session.data.user?.name)}</AvatarFallback>
                      </Avatar>
                    </DropdownMenuTrigger>

                    <DropdownMenuContent align="end" className="w-auto mt-2 rounded-md shadow-lg border bg-popover text-popover-foreground">
                      <DropdownMenuLabel >
                        <div className="font-medium">
                          {session.data.user?.name}
                        </div>
                        <span className="font-normal truncate text-xs">{session.data.user?.email}</span>
                      </DropdownMenuLabel>
                      <DropdownMenuSeparator />

                      <DropdownMenuItem className="cursor-pointer gap-2">
                        <User /> Profile
                      </DropdownMenuItem>

                      <DropdownMenuItem className="cursor-pointer gap-2">
                        <Settings /> Settings
                      </DropdownMenuItem>

                      <DropdownMenuSeparator />

                      <DropdownMenuItem onClick={() => signOutAction()} className="text-red-600 cursor-pointer gap-2">
                        <LogOut /> Logout
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </>
              ) : (
                <>
                  <Button onClick={() => push("/auth")} type="button" variant="outline" size="sm">
                    <LogIn /> Login
                  </Button>
                  <Button onClick={() => push("/auth")} type="button" className="primary" size="sm">
                    Sign Up
                  </Button>
                </>
              )
            }
          </div>
        </nav>

        {/* Mobile Menu */}
        <div className="block lg:hidden">
          <div className="flex items-center justify-between">
            <a href="/" className="flex items-center gap-2 self-center font-medium">
              <div className="px-1 py-0.5 rounded-lg bg-blue-600 text-sidebar-primary-foreground">
                <i className='bx bx-shopping-bag text-2xl'></i>
              </div>
              <div className="text-lg text-blue-600">
                {appName}
              </div>
            </a>

            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" size="icon">
                  <Menu className="size-4" />
                </Button>
              </SheetTrigger>
              <SheetContent className="overflow-y-auto gap-0">
                <SheetHeader>
                  <SheetTitle>
                    <a href="/" className="flex items-center gap-2 self-center font-medium">
                      <div className="px-1 py-0.5 rounded-lg bg-blue-600 text-sidebar-primary-foreground">
                        <i className='bx bx-shopping-bag text-2xl'></i>
                      </div>
                    </a>
                  </SheetTitle>
                </SheetHeader>
                <div className="flex flex-col gap-6 p-4">
                  {session && session.status === "authenticated" && (
                    <div className="flex items-center gap-3">
                      <Avatar className="h-9 w-9 border-2 border-ring">
                        <AvatarImage src="/profile.jpg" alt="User" />
                        <AvatarFallback className="text-sm">{getInitials(session.data.user?.name)}</AvatarFallback>
                      </Avatar>
                      <div className="flex flex-col text-sm">
                        <span className="font-medium">{session.data.user?.name}</span>
                        <span className="text-muted-foreground text-xs truncate max-w-[180px]">
                          {session.data.user?.email}
                        </span>
                      </div>
                    </div>
                  )}
                  {session && session.status === "authenticated" ? (
                    <div className="flex flex-col gap-2">
                      <Button variant="outline" className="justify-start gap-2" size="sm">
                        <ShoppingCart /> Shopping Cart
                      </Button>
                      <Button variant="outline" className="justify-start gap-2" size="sm">
                        <User /> My Profile
                      </Button>
                      <Button variant="outline" className="justify-start gap-2" size="sm">
                        <Settings /> Settings
                      </Button>
                      <Button
                        type="button"
                        onClick={() => signOutAction()}
                        variant="outline"
                        size="sm"
                        className="text-red-600 justify-start gap-2"
                      >
                        <LogOut /> Logout
                      </Button>
                    </div>
                  ) : (
                    <div className="flex flex-col gap-2">
                      <Button type="button" variant="outline">
                        <ShoppingCart /> Shopping Cart
                      </Button>
                      <Button onClick={() => push("/auth")} type="button" variant="outline">
                        <LogIn /> Login
                      </Button>
                      <Button onClick={() => push("/auth")} type="button" className="primary">
                        Sign Up
                      </Button>
                    </div>
                  )}

                  <Accordion
                    type="single"
                    collapsible
                    className="flex w-full flex-col gap-4"
                  >
                    {menu.map((item) => renderMobileMenuItem(item))}
                  </Accordion>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </section>
  );
};

const renderMenuItem = (item: MenuItem) => {
  if (item.items) {
    return (
      <NavigationMenuItem key={item.title}>
        <NavigationMenuTrigger>{item.title}</NavigationMenuTrigger>
        <NavigationMenuContent className="bg-popover text-popover-foreground">
          {item.items.map((subItem) => (
            <NavigationMenuLink asChild key={subItem.title} className="w-80">
              <SubMenuLink item={subItem} />
            </NavigationMenuLink>
          ))}
        </NavigationMenuContent>
      </NavigationMenuItem>
    );
  }

  return (
    <NavigationMenuItem key={item.title}>
      <NavigationMenuLink
        href={item.url}
        className="group inline-flex h-10 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-muted hover:text-accent-foreground"
      >
        {item.title}
      </NavigationMenuLink>
    </NavigationMenuItem>
  );
};

const renderMobileMenuItem = (item: MenuItem) => {
  if (item.items) {
    return (
      <AccordionItem key={item.title} value={item.title} className="border-b-0">
        <AccordionTrigger className="text-md py-0 font-semibold hover:no-underline">
          {item.title}
        </AccordionTrigger>
        <AccordionContent className="mt-2">
          {item.items.map((subItem) => (
            <SubMenuLink key={subItem.title} item={subItem} />
          ))}
        </AccordionContent>
      </AccordionItem>
    );
  }

  return (
    <a key={item.title} href={item.url} className="text-md font-semibold">
      {item.title}
    </a>
  );
};

const SubMenuLink = ({ item }: { item: MenuItem }) => {
  return (
    <a
      className="flex flex-row gap-4 rounded-md p-3 leading-none no-underline transition-colors outline-none select-none hover:bg-muted hover:text-accent-foreground"
      href={item.url}
    >
      <div className="text-foreground">{item.icon}</div>
      <div>
        <div className="text-sm font-semibold">{item.title}</div>
        {item.description && (
          <p className="text-sm leading-snug text-muted-foreground">
            {item.description}
          </p>
        )}
      </div>
    </a>
  );
};

export { Navbar };
