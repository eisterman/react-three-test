import { useProjectStore } from '@/stores/useProjectStore.ts';
import useBackendStore, { type Project } from '@/stores/useBackendStore.ts';

function ProjInList({ uid }: { uid: string }) {
  const setProject = useProjectStore((state) => state.setProject);
  const backendGetByUid = useBackendStore((state) => state.getByUid);
  const deleteProject = useBackendStore((state) => state.deleteProject);
  return (
    <li className='flex flex-row gap-2 items-center justify-between my-1 py-1 border '>
      <p>{uid}</p>
      <div className='mx-2'>
        <button
          className='btn btn-sm btn-info w-full'
          onClick={() => {
            const proj = backendGetByUid(uid);
            setProject(proj, uid);
          }}
        >
          Open
        </button>
        <button className='btn btn-sm btn-error w-full' onClick={() => deleteProject(uid)}>
          Delete
        </button>
      </div>
    </li>
  );
}

function NewProjectBtn() {
  const resetProject = useProjectStore((state) => state.reset);
  return (
    <button className='btn' onClick={resetProject}>
      New
    </button>
  );
}

function SaveProjectBtn() {
  const saveNewProject = useBackendStore((state) => state.saveNewProject);
  const getProject = useProjectStore((state) => state.getProject);
  function doSave() {
    const project: Project = getProject();
    const uid = saveNewProject(project);
    console.log(`New Project with uid ${uid}`);
  }
  return (
    <button className='btn' onClick={doSave}>
      Save as new
    </button>
  );
}

function OverwriteProjectBtn() {
  const remoteUid = useProjectStore((state) => state.remoteUid);
  const overwriteProject = useBackendStore((state) => state.overwriteProject);
  const getProject = useProjectStore((state) => state.getProject);
  return (
    <button
      className='btn'
      disabled={remoteUid === null}
      onClick={() => {
        if (remoteUid === null) return;
        const proj = getProject();
        overwriteProject(remoteUid, proj);
      }}
    >
      Overwrite
    </button>
  );
}

export function TestArea() {
  const remoteUid = useProjectStore((state) => state.remoteUid);
  const projectsUids = useBackendStore((state) => state.projects);
  return (
    <div className='border-red-500 border-2'>
      <p>TEST AREA</p>
      <p>Current UID: {remoteUid ?? 'null'}</p>
      <div>
        <NewProjectBtn />
        <SaveProjectBtn />
        <OverwriteProjectBtn />
      </div>
      <div className='border-green-500 border-2'>
        <p>Projects</p>
        <ul>
          {Object.keys(projectsUids).map((uid) => (
            <ProjInList uid={uid} />
          ))}
        </ul>
      </div>
    </div>
  );
}