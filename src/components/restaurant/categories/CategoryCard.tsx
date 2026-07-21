type Category = {
  id: string;
  name: string;
  description: string | null;
  is_active: boolean;
  display_order: number | null;
};

interface CategoryCardProps {
  category: Category;
  onEdit: (category: Category) => void;
  onDelete: (category: Category) => void;
}