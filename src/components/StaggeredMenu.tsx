import React, { useCallback, useLayoutEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { gsap } from 'gsap';
import './StaggeredMenu.css';

interface MenuItem {
  label: string;
  ariaLabel?: string;
  link: string;
  onClick?: () => void;
}

interface StaggeredMenuProps {
  position?: 'left' | 'right';
  colors?: string[];
  items?: MenuItem[];
  displaySocials?: boolean;
  displayItemNumbering?: boolean;
  className?: string;
  logoUrl?: string;
  menuButtonColor?: string;
  openMenuButtonColor?: string;
  accentColor?: string;
  changeMenuColorOnOpen?: boolean;
  isFixed?: boolean;
  inline?: boolean; // render toggle inline (for header alignment)
  onMenuOpen?: () => void;
  onMenuClose?: () => void;
}

export const StaggeredMenu: React.FC<StaggeredMenuProps> = ({
  position = 'right',
  colors = ['#1e1e22', '#35353c'],
  items = [],
  displaySocials = false,
  displayItemNumbering = true,
  className,
  logoUrl,
  menuButtonColor = '#fff',
  openMenuButtonColor = '#fff',
  accentColor = '#D4AF37',
  changeMenuColorOnOpen = true,
  isFixed = false,
  inline = false,
  onMenuOpen,
  onMenuClose
}) => {
  const [open, setOpen] = useState(false);
  const openRef = useRef(false);
  const panelRef = useRef<HTMLElement>(null);
  const preLayersRef = useRef<HTMLDivElement>(null);
  const preLayerElsRef = useRef<HTMLElement[]>([]);
  const plusHRef = useRef<HTMLSpanElement>(null);
  const plusVRef = useRef<HTMLSpanElement>(null);
  const iconRef = useRef<HTMLSpanElement>(null);
  const textInnerRef = useRef<HTMLSpanElement>(null);
  const textWrapRef = useRef<HTMLSpanElement>(null);
  const [textLines, setTextLines] = useState(['Menu', 'Close']);
  const [showProductsSubmenu, setShowProductsSubmenu] = useState(false);
  const navigate = useNavigate();

  const openTlRef = useRef<gsap.core.Timeline | null>(null);
  const closeTweenRef = useRef<gsap.core.Tween | null>(null);
  const spinTweenRef = useRef<gsap.core.Tween | null>(null);
  const textCycleAnimRef = useRef<gsap.core.Tween | null>(null);
  const colorTweenRef = useRef<gsap.core.Tween | null>(null);
  const toggleBtnRef = useRef<HTMLButtonElement>(null);
  const busyRef = useRef(false);
  const itemEntranceTweenRef = useRef<gsap.core.Tween | null>(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const panel = panelRef.current;
      const preContainer = preLayersRef.current;
      const plusH = plusHRef.current;
      const plusV = plusVRef.current;
      const icon = iconRef.current;
      const textInner = textInnerRef.current;
      if (!panel || !icon) return;

      let preLayers: HTMLElement[] = [];
      if (preContainer) {
        preLayers = Array.from(preContainer.querySelectorAll<HTMLElement>('.sm-prelayer'));
      }
      preLayerElsRef.current = preLayers;

      // Use x with pixel value based on panel width (50vw) to move panel off-screen
      const panelWidth = window.innerWidth * 0.5; // 50vw
      const offscreenX = position === 'left' ? -panelWidth : panelWidth;
      // Set initial transform position using x with pixel value
      gsap.set([panel, ...preLayers], { 
        x: offscreenX
      });
      
      // Only set plusH/plusV if they exist (non-inline mode)
      if (plusH) gsap.set(plusH, { transformOrigin: '50% 50%', rotate: 0 });
      if (plusV) gsap.set(plusV, { transformOrigin: '50% 50%', rotate: 90 });
      gsap.set(icon, { rotate: 0, transformOrigin: '50% 50%' });
      if (textInner) gsap.set(textInner, { yPercent: 0 });
      if (toggleBtnRef.current) gsap.set(toggleBtnRef.current, { color: menuButtonColor });
    });
    return () => ctx.revert();
  }, [menuButtonColor, position]);

  const buildOpenTimeline = useCallback(() => {
    const panel = panelRef.current;
    const layers = preLayerElsRef.current;
    if (!panel) {
      console.warn('Panel ref not found');
      return null;
    }

    openTlRef.current?.kill();
    if (closeTweenRef.current) {
      closeTweenRef.current.kill();
      closeTweenRef.current = null;
    }
    itemEntranceTweenRef.current?.kill();

    // Make sure panel is visible before animating
    gsap.set(panel, { display: 'flex', visibility: 'visible', opacity: 1 });

    const itemEls = Array.from(panel.querySelectorAll<HTMLElement>('.sm-panel-itemLabel'));
    const numberEls = Array.from(panel.querySelectorAll<HTMLElement>('.sm-panel-list[data-numbering] .sm-panel-item'));
    const socialTitle = panel.querySelector<HTMLElement>('.sm-socials-title');
    const socialLinks = Array.from(panel.querySelectorAll<HTMLElement>('.sm-socials-link'));

    // Get current x position in pixels
    const getX = (el: HTMLElement): number => {
      const current = gsap.getProperty(el, 'x');
      if (current !== undefined && current !== null) {
        return Number(current);
      }
      // Fallback: check computed style
      const style = window.getComputedStyle(el);
      const transform = style.transform;
      if (transform && transform !== 'none') {
        const matrix = new DOMMatrix(transform);
        return matrix.m41; // x translation in pixels
      }
      // Default: off-screen position (50vw)
      const panelWidth = window.innerWidth * 0.5;
      return position === 'left' ? -panelWidth : panelWidth;
    };

    const layerStates = layers.map(el => ({ el, start: getX(el) }));
    const panelStart = getX(panel);

    if (itemEls.length) {
      gsap.set(itemEls, { yPercent: 140, rotate: 10 });
    }
    if (numberEls.length) {
      gsap.set(numberEls, { '--sm-num-opacity': 0 });
    }
    if (socialTitle) {
      gsap.set(socialTitle, { opacity: 0 });
    }
    if (socialLinks.length) {
      gsap.set(socialLinks, { y: 25, opacity: 0 });
    }

    const tl = gsap.timeline({ paused: true });

    // Animate layers first
    if (layerStates.length > 0) {
      layerStates.forEach((ls, i) => {
        tl.fromTo(
          ls.el, 
          { 
            x: ls.start,
            display: 'block',
            visibility: 'visible'
          }, 
          { 
            x: 0, 
            duration: 0.5, 
            ease: 'power4.out',
            force3D: true
          }, 
          i * 0.07
        );
      });
    }
    
    // Start panel animation immediately (no delay)
    const panelDuration = 0.65;
    
    // Animate panel - use x with pixel values to move from off-screen to on-screen
    // Start immediately, not waiting for layers
    tl.fromTo(
      panel,
      { 
        x: panelStart,
        display: 'flex',
        visibility: 'visible',
        immediateRender: false
      },
      { 
        x: 0, 
        duration: panelDuration, 
        ease: 'power4.out',
        force3D: true,
        onStart: () => {
          gsap.set(panel, { display: 'flex', visibility: 'visible' });
        }
      },
      0 // Start immediately at time 0
    );

    if (itemEls.length) {
      const itemsStartRatio = 0.15;
      const itemsStart = panelDuration * itemsStartRatio; // Start earlier, no panelInsertTime delay
      tl.to(
        itemEls,
        {
          yPercent: 0,
          rotate: 0,
          duration: 1,
          ease: 'power4.out',
          stagger: { each: 0.1, from: 'start' }
        },
        itemsStart
      );
      if (numberEls.length) {
        tl.to(
          numberEls,
          {
            duration: 0.6,
            ease: 'power2.out',
            '--sm-num-opacity': 1,
            stagger: { each: 0.08, from: 'start' }
          },
          itemsStart + 0.1
        );
      }
    }

    if (socialTitle || socialLinks.length) {
      const socialsStart = panelDuration * 0.4; // Start earlier, no panelInsertTime delay
      if (socialTitle) {
        tl.to(
          socialTitle,
          {
            opacity: 1,
            duration: 0.5,
            ease: 'power2.out'
          },
          socialsStart
        );
      }
      if (socialLinks.length) {
        tl.to(
          socialLinks,
          {
            y: 0,
            opacity: 1,
            duration: 0.55,
            ease: 'power3.out',
            stagger: { each: 0.08, from: 'start' },
            onComplete: () => {
              gsap.set(socialLinks, { clearProps: 'opacity' });
            }
          },
          socialsStart + 0.04
        );
      }
    }

    openTlRef.current = tl;
    return tl;
  }, [position]);

  const playOpen = useCallback(() => {
    if (busyRef.current) return;
    busyRef.current = true;
    
    const panel = panelRef.current;
    if (!panel) {
      busyRef.current = false;
      return;
    }
    
    // Force panel to be visible and in correct position
    panel.style.display = 'flex';
    panel.style.visibility = 'visible';
    panel.style.opacity = '1';
    panel.style.pointerEvents = 'auto';
    
    // Set initial position using x with pixel value (50vw)
    const panelWidth = window.innerWidth * 0.5; // 50vw
    const offscreenX = position === 'left' ? -panelWidth : panelWidth;
    gsap.set(panel, { x: offscreenX });
    
    const tl = buildOpenTimeline();
    if (tl) {
      tl.eventCallback('onComplete', () => {
        busyRef.current = false;
      });
      // Play immediately without delay
      tl.play(0);
    } else {
      busyRef.current = false;
    }
  }, [buildOpenTimeline, position]);

  const playClose = useCallback(() => {
    openTlRef.current?.kill();
    openTlRef.current = null;
    itemEntranceTweenRef.current?.kill();

    const panel = panelRef.current;
    const layers = preLayerElsRef.current;
    if (!panel) return;

    const all = [...layers, panel];
    closeTweenRef.current?.kill();
    const panelWidth = window.innerWidth * 0.5; // 50vw
    const offscreenX = position === 'left' ? -panelWidth : panelWidth;
    closeTweenRef.current = gsap.to(all, {
      x: offscreenX,
      duration: 0.32,
      ease: 'power3.in',
      overwrite: 'auto',
      onComplete: () => {
        const itemEls = Array.from(panel.querySelectorAll<HTMLElement>('.sm-panel-itemLabel'));
        if (itemEls.length) {
          gsap.set(itemEls, { yPercent: 140, rotate: 10 });
        }
        const numberEls = Array.from(panel.querySelectorAll<HTMLElement>('.sm-panel-list[data-numbering] .sm-panel-item'));
        if (numberEls.length) {
          gsap.set(numberEls, { '--sm-num-opacity': 0 });
        }
        const socialTitle = panel.querySelector<HTMLElement>('.sm-socials-title');
        const socialLinks = Array.from(panel.querySelectorAll<HTMLElement>('.sm-socials-link'));
        if (socialTitle) gsap.set(socialTitle, { opacity: 0 });
        if (socialLinks.length) gsap.set(socialLinks, { y: 25, opacity: 0 });
        busyRef.current = false;
      }
    });
  }, [position]);

  const animateIcon = useCallback((opening: boolean) => {
    const icon = iconRef.current;
    if (!icon) return;
    spinTweenRef.current?.kill();
    if (opening) {
      spinTweenRef.current = gsap.to(icon, { rotate: 180, duration: 0.8, ease: 'power4.out', overwrite: 'auto' });
    } else {
      spinTweenRef.current = gsap.to(icon, { rotate: 0, duration: 0.35, ease: 'power3.inOut', overwrite: 'auto' });
    }
  }, []);

  const animateColor = useCallback(
    (opening: boolean) => {
      const btn = toggleBtnRef.current;
      if (!btn) return;
      colorTweenRef.current?.kill();
      if (changeMenuColorOnOpen) {
        const targetColor = opening ? openMenuButtonColor : menuButtonColor;
        colorTweenRef.current = gsap.to(btn, {
          color: targetColor,
          delay: 0, // No delay
          duration: 0.3,
          ease: 'power2.out'
        });
      } else {
        gsap.set(btn, { color: menuButtonColor });
      }
    },
    [openMenuButtonColor, menuButtonColor, changeMenuColorOnOpen]
  );

  React.useEffect(() => {
    if (toggleBtnRef.current) {
      if (changeMenuColorOnOpen) {
        const targetColor = openRef.current ? openMenuButtonColor : menuButtonColor;
        gsap.set(toggleBtnRef.current, { color: targetColor });
      } else {
        gsap.set(toggleBtnRef.current, { color: menuButtonColor });
      }
    }
  }, [changeMenuColorOnOpen, menuButtonColor, openMenuButtonColor]);

  const animateText = useCallback((opening: boolean) => {
    const inner = textInnerRef.current;
    if (!inner) return;
    textCycleAnimRef.current?.kill();

    const currentLabel = opening ? 'Menu' : 'Close';
    const targetLabel = opening ? 'Close' : 'Menu';
    const cycles = 3;
    const seq = [currentLabel];
    let last = currentLabel;
    for (let i = 0; i < cycles; i++) {
      last = last === 'Menu' ? 'Close' : 'Menu';
      seq.push(last);
    }
    if (last !== targetLabel) seq.push(targetLabel);
    seq.push(targetLabel);
    setTextLines(seq);

    gsap.set(inner, { yPercent: 0 });
    const lineCount = seq.length;
    const finalShift = ((lineCount - 1) / lineCount) * 100;
    textCycleAnimRef.current = gsap.to(inner, {
      yPercent: -finalShift,
      duration: 0.5 + lineCount * 0.07,
      ease: 'power4.out'
    });
  }, []);

  const toggleMenu = useCallback((e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    const target = !openRef.current;
    openRef.current = target;
    setOpen(target);
    if (target) {
      onMenuOpen?.();
      playOpen();
    } else {
      onMenuClose?.();
      playClose();
    }
    animateIcon(target);
    animateColor(target);
    if (!inline) animateText(target);
  }, [playOpen, playClose, animateIcon, animateColor, animateText, onMenuOpen, onMenuClose, inline]);

  // Handle ESC key to close menu (do not lock page scroll)
  React.useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && openRef.current) {
        toggleMenu();
      }
    };
    if (openRef.current) {
      document.addEventListener('keydown', handleEsc);
    }
    return () => {
      document.removeEventListener('keydown', handleEsc);
    };
  }, [open, toggleMenu]);

  // Close on outside click only (keep menu open on scroll - no scroll listener)
  React.useEffect(() => {
    if (!openRef.current) return;
    const handleClickOutside = (e: MouseEvent) => {
      const panel = panelRef.current as unknown as Node | null;
      const btn = toggleBtnRef.current as unknown as Node | null;
      const exitBtn = (e.target as HTMLElement)?.closest('.sm-exit-button');
      const target = e.target as Node;
      if (panel && panel.contains(target)) return;
      if (btn && btn.contains(target)) return;
      if (exitBtn) return; // Exit button handles its own click
      // clicked outside panel and button
      if (openRef.current) toggleMenu();
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [open, toggleMenu]);

  return (
    <div
      className={(className ? className + ' ' : '') + 'staggered-menu-wrapper' + (isFixed && !inline ? ' fixed-wrapper' : '') + (inline ? ' inline-wrapper' : '')}
      style={{
        ...(accentColor ? { ['--sm-accent' as string]: accentColor } : {}),
        ...(inline ? { position: 'relative', zIndex: 100 } : {})
      }}
      data-position={position}
      data-open={open || undefined}
    >
      {inline ? (
        // Inline compact hamburger toggle (no header wrapper)
        <button
          ref={toggleBtnRef}
          className="sm-toggle p-3 rounded-md hover:bg-white/10 transition-colors"
          aria-label={open ? 'Close menu' : 'Open menu'}
          aria-expanded={open}
          aria-controls="staggered-menu-panel"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            toggleMenu(e);
          }}
          onMouseDown={(e) => {
            e.stopPropagation();
          }}
          type="button"
          style={{ 
            position: 'relative', 
            zIndex: 10001,
            cursor: 'pointer',
            border: '1px solid rgba(255,255,255,0.3)'
          }}
        >
          <span ref={iconRef} className="sm-icon" aria-hidden="true" style={{ width: 32, height: 24 }}>
            <span className="sm-icon-line" style={{ top: '26%', height: 3.5, width: '100%' }} />
            <span className="sm-icon-line" style={{ top: '50%', height: 3.5, width: '100%' }} />
            <span className="sm-icon-line" style={{ top: '74%', height: 3.5, width: '100%' }} />
          </span>
        </button>
      ) : (
        <header className="staggered-menu-header" aria-label="Main navigation header">
          {logoUrl && (
            <div className="sm-logo" aria-label="Logo">
              <img
                src={logoUrl}
                alt="Logo"
                className="sm-logo-img"
                draggable={false}
                width={110}
                height={24}
              />
            </div>
          )}
          <button
            ref={toggleBtnRef}
            className="sm-toggle"
            aria-label={open ? 'Close menu' : 'Open menu'}
            aria-expanded={open}
            aria-controls="staggered-menu-panel"
            onClick={toggleMenu}
            type="button"
          >
            <span ref={textWrapRef} className="sm-toggle-textWrap" aria-hidden="true">
              <span ref={textInnerRef} className="sm-toggle-textInner">
                {textLines.map((l, i) => (
                  <span className="sm-toggle-line" key={i}>
                    {l}
                  </span>
                ))}
              </span>
            </span>
            <span ref={iconRef} className="sm-icon" aria-hidden="true">
              <span ref={plusHRef} className="sm-icon-line" />
              <span ref={plusVRef} className="sm-icon-line sm-icon-line-v" />
            </span>
          </button>
        </header>
      )}

      {/* Prelayers and Panel - rendered as siblings to the toggle/header */}
      <div ref={preLayersRef} className="sm-prelayers" aria-hidden="true">
        {(() => {
          const raw = colors && colors.length ? colors.slice(0, 4) : ['#1e1e22', '#35353c'];
          let arr = [...raw];
          if (arr.length >= 3) {
            const mid = Math.floor(arr.length / 2);
            arr.splice(mid, 1);
          }
          return arr.map((c, i) => <div key={i} className="sm-prelayer" style={{ background: c }} />);
        })()}
      </div>

      <aside 
        id="staggered-menu-panel" 
        ref={panelRef} 
        className="staggered-menu-panel" 
        aria-hidden={!open}
        style={{ 
          display: open ? 'flex' : 'flex',
          visibility: open ? 'visible' : 'hidden'
        }}
      >
        {/* Exit button */}
        <button
          className="sm-exit-button"
          aria-label="Close menu"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            toggleMenu();
          }}
          type="button"
        >
          ×
        </button>
        <div className="sm-panel-inner">
          <ul className="sm-panel-list" role="list" data-numbering={displayItemNumbering || undefined}>
            {items && items.length ? (
              items.map((it, idx) => (
                <li className="sm-panel-itemWrap" key={it.label + idx}>
                  {/* Special handler for Products submenu trigger */}
                  {it.link === '#__products' ? (
                    <button
                      className="sm-panel-item"
                      aria-label={it.ariaLabel || it.label}
                      data-index={idx + 1}
                      onClick={() => setShowProductsSubmenu(v => !v)}
                    >
                      <span className="sm-panel-itemLabel">{it.label}</span>
                    </button>
                  ) : it.onClick ? (
                    <button
                      className="sm-panel-item"
                      aria-label={it.ariaLabel || it.label}
                      data-index={idx + 1}
                      onClick={() => {
                        it.onClick?.();
                        toggleMenu();
                      }}
                    >
                      <span className="sm-panel-itemLabel">{it.label}</span>
                    </button>
                  ) : it.link.includes('#') ? (
                    <button
                      className="sm-panel-item"
                      aria-label={it.ariaLabel || it.label}
                      data-index={idx + 1}
                      onClick={(e) => {
                        e.preventDefault();
                        const [path, hash] = it.link.split('#');
                        if (path && path !== window.location.pathname) {
                          // Navigate to new page with hash
                          navigate(path);
                          if (hash) {
                            // Wait for page to load, then scroll to hash
                            setTimeout(() => {
                              const element = document.getElementById(hash);
                              if (element) {
                                element.scrollIntoView({ behavior: 'smooth', block: 'start' });
                              }
                            }, 100);
                          }
                        } else if (hash) {
                          // Same page, just scroll to hash
                          const element = document.getElementById(hash);
                          if (element) {
                            element.scrollIntoView({ behavior: 'smooth', block: 'start' });
                          }
                        }
                        toggleMenu();
                      }}
                    >
                      <span className="sm-panel-itemLabel">{it.label}</span>
                    </button>
                  ) : (
                    <Link
                      className="sm-panel-item"
                      to={it.link}
                      aria-label={it.ariaLabel || it.label}
                      data-index={idx + 1}
                      onClick={toggleMenu}
                    >
                      <span className="sm-panel-itemLabel">{it.label}</span>
                    </Link>
                  )}
                  {/* Inline submenu for Products */}
                  {it.link === '#__products' && showProductsSubmenu && (
                    <ul role="list" className="mt-2 pl-4">
                      <li className="sm-panel-itemWrap">
                        <Link 
                          className="sm-panel-item sm-panel-subitem" 
                          to="/products" 
                          onClick={(e) => {
                            e.preventDefault();
                            navigate('/products');
                            toggleMenu();
                          }}
                          aria-label="All Products"
                        >
                          <span className="sm-panel-itemLabel">All Products</span>
                        </Link>
                      </li>
                      <li className="sm-panel-itemWrap">
                        <button
                          className="sm-panel-item sm-panel-subitem"
                          onClick={(e) => {
                            e.preventDefault();
                            navigate('/products?openFilter=dimension');
                            toggleMenu();
                          }}
                          aria-label="By Dimension"
                        >
                          <span className="sm-panel-itemLabel">By Dimension</span>
                        </button>
                      </li>
                      <li className="sm-panel-itemWrap">
                        <button
                          className="sm-panel-item sm-panel-subitem"
                          onClick={(e) => {
                            e.preventDefault();
                            navigate('/products?openFilter=material');
                            toggleMenu();
                          }}
                          aria-label="By Material"
                        >
                          <span className="sm-panel-itemLabel">By Material</span>
                        </button>
                      </li>
                    </ul>
                  )}
                </li>
              ))
            ) : (
              <li className="sm-panel-itemWrap" aria-hidden="true">
                <span className="sm-panel-item">
                  <span className="sm-panel-itemLabel">No items</span>
                </span>
              </li>
            )}
          </ul>
        </div>
      </aside>
    </div>
  );
};

export default StaggeredMenu;
