import { useAuth } from "../auth/AuthContext";
import { CreateGroupButton } from "../components/CreateGroupButton";
import { useToast } from "../toast/ToastContext";

// The landing page for signed-in users. The groups sections stay empty until
// the group issues fill them with real data.
export function HomePage() {
  const { user } = useAuth();
  const { showToast } = useToast();

  return (
    <>
      <section className="mb-8 flex flex-col items-start gap-4 md:flex-row md:justify-between">
        <div>
          <h1 className="mb-1 text-2xl leading-tight font-medium">
            Welcome, {user?.username}
          </h1>
          <p className="text-muted">Find a study group or manage your own.</p>
        </div>
        <CreateGroupButton
          onCreated={(group) => {
            showToast(`Group “${group.title}” created.`);
          }}
        />
      </section>
    </>
  );
}
