"use client";

import { useAppDispatch, useAppSelector } from "@/shared/hooks/useReduxHooks";
import { updateProfileThunk } from "@/entities/user/api/UserApiThunk";
import type { UserType } from "@/entities/user/model";
import { showToast } from "@/shared/lib/toast";
import "./ProfileAvatarEditor.css";

export default function ProfileAvatarEditor({
  user,
  setUser,
}: {
  user: UserType;
  setUser: React.Dispatch<React.SetStateAction<UserType | null>>;
}) {
  const dispatch = useAppDispatch();
  const loading = useAppSelector((el) => el.user.isLoading);
  const avatar = user.avatar ?? "";

  const onSubmit = async (e: React.ChangeEvent<HTMLFormElement>) => {
    e.preventDefault();
    const url = String(
      new FormData(e.currentTarget).get("avatar") ?? "",
    ).trim();
    if (!url || url === avatar) return;

    try {
      setUser(await dispatch(updateProfileThunk({ avatar: url })).unwrap());
      e.currentTarget.closest("details")?.removeAttribute("open");
    } catch {
      showToast("Не удалось обновить аватарку", "error");
    }
  };

  return (
    <>
      {" "}
      <details className="personal-avatar-editor">
        <summary aria-label="Изменить аватарку">
          <div className="personal-avatar-wrap">
            {avatar ? (
              <>
                <img
                  src={avatar}
                  alt=""
                  className="personal-avatar personal-avatar-image"
                />
              </>
            ) : (
              <div className="personal-avatar">{user.name?.[0] ?? "?"}</div>
            )}
            <span className="personal-avatar-overlay">Изменить аватарку</span>
          </div>
        </summary>

        <form key={avatar} className="personal-avatar-form" onSubmit={onSubmit}>
          <input
            name="avatar"
            type="url"
            placeholder="https://..."
            defaultValue={avatar}
            required
          />
          <button type="submit" disabled={loading}>
            {loading ? "…" : "OK"}
          </button>
        </form>
      </details>
    </>
  );
}
