import React from 'react'
import PropTypes from 'prop-types'
import cx from 'classnames'

// NOTE: The Slide component should be thought of as a light wrapper for content.
// Consider the use of fragments below, adding things like an `click` handler, or
// any other DOM event handlers through React properties will simply not work. 
// Should this trigger a warning?
export default function Slide ({
  children,
  className,
  onActive,
  isPortaled = false,
  ...rest
}) {
  if (isPortaled) {
    return <React.Fragment>{children}</React.Fragment>
  }

  return (
    <div className={cx('swiper-slide', className)} {...rest}>
      {children}
    </div>
  )
}

Slide.propTypes = {
  onActive: PropTypes.func,
  children: PropTypes.node,
  className: PropTypes.string,
  isPortaled: PropTypes.bool
}
