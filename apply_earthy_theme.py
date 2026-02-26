import os
import re

FRONTEND_DIR = r'f:\integration\NexusJKLU\nexusjklu_frontend'
DIRS_TO_SCAN = ['app', 'components']

# Mappings for regex replacement
REPLACEMENTS = [
    # Backgrounds
    (r'bg-\[\#0a0a0a\]', 'bg-nexus-black'),
    (r'bg-\[\#050505\]', 'bg-nexus-black'),
    (r'bg-\[\#111111\]', 'bg-nexus-green'),
    (r'bg-\[\#111\]', 'bg-nexus-green'),
    (r'bg-\[\#151515\]', 'bg-nexus-green'),
    (r'bg-\[\#222222\]', 'bg-nexus-jet'),
    (r'bg-\[\#222\]', 'bg-nexus-jet'),
    (r'bg-black', 'bg-nexus-black'),
    
    # Text (Base)
    (r'text-white(?![A-Za-z0-9/-])', 'text-nexus-linen'),
    (r'text-white/80', 'text-nexus-khaki'),
    (r'text-white/70', 'text-nexus-khaki'),
    (r'text-white/60', 'text-nexus-khaki'),
    (r'text-white/50', 'text-nexus-camel'),
    (r'text-white/40', 'text-nexus-camel'),
    (r'text-gray-300', 'text-nexus-khaki'),
    (r'text-gray-400', 'text-nexus-khaki'),
    (r'text-gray-500', 'text-nexus-camel'),
    
    # Text (Highlights)
    (r'text-indigo-400', 'text-nexus-brass'),
    (r'text-indigo-500', 'text-nexus-coffee'),
    (r'text-purple-400', 'text-nexus-brass'),
    
    # Borders
    (r'border-white/10', 'border-nexus-camel/20'),
    (r'border-white/5', 'border-nexus-camel/10'),
    (r'border-white/20', 'border-nexus-camel/30'),
    
    # Gradients / Accents 
    (r'from-indigo-500', 'from-nexus-coffee'),
    (r'to-indigo-500', 'to-nexus-coffee'),
    (r'from-purple-500', 'from-nexus-cocoa'),
    (r'to-purple-500', 'to-nexus-cocoa'),
    (r'from-indigo-900', 'from-nexus-coffee/40'),
    (r'from-purple-900', 'from-nexus-cocoa/40'),
    (r'shadow-indigo-500', 'shadow-nexus-coffee'),
    (r'bg-indigo-500', 'bg-nexus-coffee'),
    (r'bg-indigo-600', 'bg-nexus-coffee/80'),
    (r'hover:bg-indigo-600', 'hover:bg-nexus-coffee/80'),
]

files_modified = 0

for target_dir in DIRS_TO_SCAN:
    dir_path = os.path.join(FRONTEND_DIR, target_dir)
    for root, _, files in os.walk(dir_path):
        for file in files:
            if file.endswith('.tsx') or file.endswith('.ts'):
                file_path = os.path.join(root, file)
                try:
                    with open(file_path, 'r', encoding='utf-8') as f:
                        content = f.read()
                    
                    original_content = content
                    for pattern, replacement in REPLACEMENTS:
                        # Use regex sub for precise matching, though some are simple strings
                        content = re.sub(pattern, replacement, content)
                    
                    if content != original_content:
                        with open(file_path, 'w', encoding='utf-8') as f:
                            f.write(content)
                        files_modified += 1
                        print(f"Updated: {file_path}")
                except Exception as e:
                    print(f"Error processing {file_path}: {e}")

print(f"Successfully updated {files_modified} files with the Earthy Coffee Theme.")
