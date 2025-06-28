// extensions/FontSize.ts
import { Mark, mergeAttributes } from "@tiptap/core";

export const FontSize = Mark.create({
  name: "fontSize",

  addAttributes() {
    return {
      size: {
        default: null,
        parseHTML: element => element.style.fontSize.replace("px", ""),
        renderHTML: attributes => {
          if (!attributes.size) return {};
          return {
            style: `font-size: ${attributes.size}px`,
          };
        },
      },
    };
  },

  parseHTML() {
    return [{ style: "font-size" }];
  },

  renderHTML({ HTMLAttributes }) {
    return ["span", mergeAttributes(HTMLAttributes), 0];
  },

  addCommands() {
    return {
      setFontSize:
        size =>
        ({ commands }) =>
          commands.setMark("fontSize", { size }),
    };
  },
});
