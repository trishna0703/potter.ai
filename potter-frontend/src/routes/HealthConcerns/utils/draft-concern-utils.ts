export interface DraftConcern {
  id: string;
  object_key: string;
  created_at: string;
}
const DRAFT_CONCERNS_KEY = "potter:draft-concerns";

export const getDraftConcerns = (): DraftConcern[] => {
  const stored = localStorage.getItem(DRAFT_CONCERNS_KEY);

  if (!stored) return [];

  try {
    return JSON.parse(stored);
  } catch {
    return [];
  }
};

export const getDraftConcern = (draftId: string): DraftConcern | null => {
  const stored = localStorage.getItem(DRAFT_CONCERNS_KEY);

  if (!stored) return null;

  try {
    const drafts: DraftConcern[] = JSON.parse(stored);

    return drafts.find((draft) => draft.object_key === draftId) ?? null;
  } catch {
    return null;
  }
};

export const addDraftConcern = (draft: DraftConcern) => {
  const drafts = getDraftConcerns();

  localStorage.setItem(DRAFT_CONCERNS_KEY, JSON.stringify([...drafts, draft]));
};

export const removeDraftConcern = (id: string) => {
  const drafts = getDraftConcerns();

  localStorage.setItem(
    DRAFT_CONCERNS_KEY,
    JSON.stringify(drafts.filter((draft) => draft.object_key !== id)),
  );
};

export function formatRelativeDate(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();

  const diffMs = now.getTime() - date.getTime();
  const diffMinutes = Math.floor(diffMs / (1000 * 60));
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  // Less than 24 hours
  if (diffHours < 24) {
    if (diffMinutes < 1) {
      return "Just now";
    }

    if (diffMinutes < 60) {
      return `${diffMinutes}m ago`;
    }

    return `${diffHours}h ago`;
  }

  // 24 hours to 6 days
  if (diffDays <= 6) {
    return `${diffDays}d ago`;
  }

  // More than 6 days
  return date.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

