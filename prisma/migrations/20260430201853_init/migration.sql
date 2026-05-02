-- CreateTable
CREATE TABLE "Professional" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nombre" TEXT NOT NULL,
    "rol" TEXT NOT NULL,
    "correo" TEXT NOT NULL,
    "password" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "Student" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nombre" TEXT NOT NULL,
    "rut" TEXT NOT NULL,
    "curso" TEXT NOT NULL,
    "diagnostico" TEXT NOT NULL,
    "apoderado" TEXT NOT NULL,
    "telefono" TEXT NOT NULL,
    "correo" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "Material" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "actividad" TEXT NOT NULL,
    "asignatura" TEXT NOT NULL,
    "objetivos" TEXT NOT NULL,
    "recomendaciones" TEXT,
    "fecha_carga" TEXT NOT NULL,
    "fecha_inicio" TEXT NOT NULL,
    "fecha_termino" TEXT NOT NULL,
    "estado" TEXT NOT NULL DEFAULT 'Pendiente',
    "acceso" TEXT NOT NULL DEFAULT 'Sin acceso',
    "link" TEXT,
    "archivo_url" TEXT,
    "professionalId" INTEGER NOT NULL,
    "studentId" INTEGER NOT NULL,
    CONSTRAINT "Material_professionalId_fkey" FOREIGN KEY ("professionalId") REFERENCES "Professional" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Material_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "Student" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "Professional_correo_key" ON "Professional"("correo");

-- CreateIndex
CREATE UNIQUE INDEX "Student_rut_key" ON "Student"("rut");
