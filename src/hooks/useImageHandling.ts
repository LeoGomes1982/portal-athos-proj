
import { useState, useCallback } from 'react';

export const useImageHandling = () => {
  const [selectedImage, setSelectedImage] = useState<HTMLImageElement | null>(null);
  const [isResizing, setIsResizing] = useState(false);
  const [resizeHandle, setResizeHandle] = useState<string>('');

  const handleImageUpload = useCallback((file: File, editorRef: React.RefObject<HTMLDivElement>) => {
    console.log('Starting image upload process:', file.name, file.type);
    
    if (!file.type.startsWith('image/')) {
      console.error('File is not an image:', file.type);
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      console.log('File read successfully, creating image element');
      if (editorRef.current && e.target?.result) {
        const selection = window.getSelection();
        if (selection && selection.rangeCount > 0) {
          const range = selection.getRangeAt(0);
          const img = document.createElement('img');
          img.src = e.target.result as string;
          img.style.cssText = `
            max-width: 300px;
            height: auto;
            margin: 10px;
            cursor: pointer;
            border: 2px solid transparent;
            display: inline-block;
          `;
          img.alt = file.name;
          
          img.addEventListener('click', (event) => {
            event.stopPropagation();
            console.log('Image clicked, adding resize handles');
            addResizeHandles(img);
          });
          
          range.insertNode(img);
          console.log('Image inserted into editor');
          
          setTimeout(() => {
            addResizeHandles(img);
          }, 100);
        } else {
          console.log('No selection found, appending image to editor');
          const img = document.createElement('img');
          img.src = e.target.result as string;
          img.style.cssText = `
            max-width: 300px;
            height: auto;
            margin: 10px;
            cursor: pointer;
            border: 2px solid transparent;
            display: block;
          `;
          img.alt = file.name;
          
          img.addEventListener('click', (event) => {
            event.stopPropagation();
            addResizeHandles(img);
          });
          
          editorRef.current.appendChild(img);
          addResizeHandles(img);
        }
      }
    };
    
    reader.onerror = (error) => {
      console.error('Error reading file:', error);
    };
    
    reader.readAsDataURL(file);
  }, []);

  const addResizeHandles = useCallback((img: HTMLImageElement) => {
    removeResizeHandles();
    
    const wrapper = document.createElement('div');
    wrapper.className = 'image-resize-wrapper';
    wrapper.style.cssText = `
      position: relative;
      display: inline-block;
      border: 2px solid #007bff;
      cursor: move;
    `;
    
    img.parentNode?.insertBefore(wrapper, img);
    wrapper.appendChild(img);
    
    const handles = ['nw', 'ne', 'sw', 'se', 'n', 's', 'e', 'w'];
    handles.forEach(handle => {
      const handleElement = document.createElement('div');
      handleElement.className = `resize-handle resize-${handle}`;
      handleElement.style.cssText = `
        position: absolute;
        width: 8px;
        height: 8px;
        background: #007bff;
        border: 1px solid white;
        cursor: ${handle.includes('n') || handle.includes('s') ? 
          (handle.includes('e') || handle.includes('w') ? 
            (handle.includes('nw') || handle.includes('se') ? 'nw-resize' : 'ne-resize') 
            : 'ns-resize') 
          : (handle.includes('e') || handle.includes('w') ? 'ew-resize' : 'move')};
        z-index: 10;
      `;
      
      if (handle.includes('n')) handleElement.style.top = '-4px';
      if (handle.includes('s')) handleElement.style.bottom = '-4px';
      if (handle.includes('e')) handleElement.style.right = '-4px';
      if (handle.includes('w')) handleElement.style.left = '-4px';
      if (handle === 'n' || handle === 's') {
        handleElement.style.left = '50%';
        handleElement.style.transform = 'translateX(-50%)';
      }
      if (handle === 'e' || handle === 'w') {
        handleElement.style.top = '50%';
        handleElement.style.transform = 'translateY(-50%)';
      }
      
      handleElement.addEventListener('mousedown', (e) => {
        e.preventDefault();
        e.stopPropagation();
        startResize(img, handle, e);
      });
      
      wrapper.appendChild(handleElement);
    });
    
    setSelectedImage(img);
  }, []);

  const removeResizeHandles = useCallback(() => {
    const wrappers = document.querySelectorAll('.image-resize-wrapper');
    wrappers.forEach(wrapper => {
      const img = wrapper.querySelector('img');
      if (img && wrapper.parentNode) {
        wrapper.parentNode.insertBefore(img, wrapper);
        wrapper.remove();
      }
    });
    setSelectedImage(null);
  }, []);

  const startResize = useCallback((img: HTMLImageElement, handle: string, e: MouseEvent) => {
    setIsResizing(true);
    setResizeHandle(handle);
    
    const startX = e.clientX;
    const startY = e.clientY;
    const startWidth = img.offsetWidth;
    const startHeight = img.offsetHeight;
    const aspectRatio = startWidth / startHeight;

    const handleMouseMove = (e: MouseEvent) => {
      const deltaX = e.clientX - startX;
      const deltaY = e.clientY - startY;
      
      let newWidth = startWidth;
      let newHeight = startHeight;
      
      // Handle horizontal resizing
      if (handle.includes('e')) {
        newWidth = Math.max(20, startWidth + deltaX);
      } else if (handle.includes('w')) {
        newWidth = Math.max(20, startWidth - deltaX);
      }
      
      // Handle vertical resizing
      if (handle.includes('s')) {
        newHeight = Math.max(20, startHeight + deltaY);
      } else if (handle.includes('n')) {
        newHeight = Math.max(20, startHeight - deltaY);
      }
      
      // For corner handles, maintain aspect ratio
      if (handle.length === 2) {
        if (handle.includes('e') || handle.includes('w')) {
          newHeight = newWidth / aspectRatio;
        } else if (handle.includes('n') || handle.includes('s')) {
          newWidth = newHeight * aspectRatio;
        }
      }
      
      // For side handles, only resize in one direction
      if (handle === 'e' || handle === 'w') {
        newHeight = startHeight; // Keep original height for horizontal resizing
      } else if (handle === 'n' || handle === 's') {
        newWidth = startWidth; // Keep original width for vertical resizing
      }
      
      // Apply the new dimensions
      img.style.width = newWidth + 'px';
      img.style.height = newHeight + 'px';
      img.style.maxWidth = 'none'; // Remove max-width constraint during resize
    };

    const handleMouseUp = () => {
      setIsResizing(false);
      setResizeHandle('');
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  }, []);

  return {
    selectedImage,
    isResizing,
    resizeHandle,
    handleImageUpload,
    addResizeHandles,
    removeResizeHandles
  };
};
