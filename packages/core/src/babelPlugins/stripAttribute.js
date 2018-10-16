const stripAttribute = () => ({
  visitor: {
    JSXAttribute: {
      enter(path, state) {
        const { attribute } = state.opts
        if (path.node.name.name === attribute) {
          path.remove()
        }
      },
    },
  },
})

export default stripAttribute
