const links = [
  { href: '/our-history', label: 'Our History' },
  { href: '/access', label: 'Access' },
  { href: '/projects', label: 'Projects and Funding' },
  { href: '/policies', label: 'Policies' },
  { href: '/advisory-boards', label: 'Advisory Boards' },
  { href: '/faq', label: 'FAQ' },
  { href: '/contact-us', label: 'Contact Us' },
];

export default function LinkBankFooter() {
  const left = links.slice(0, 4);
  const right = links.slice(4);

  return (
    <div className="link-bank">
      <div className="link-bank-col">
        {left.map((link, index) => (
          <div key={link.href}>
            {index > 0 && <hr />}
            <a href={link.href}>{link.label}</a>
          </div>
        ))}
      </div>
      <div className="link-bank-col">
        {right.map((link, index) => (
          <div key={link.href}>
            {index > 0 && <hr />}
            <a href={link.href}>{link.label}</a>
          </div>
        ))}
      </div>
    </div>
  );
}