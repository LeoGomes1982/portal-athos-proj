import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Building2 } from "lucide-react";

export default function PortalBPO() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mb-6 shadow-lg mx-auto">
            <Building2 className="text-white text-3xl" size={40} />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Portal do BPO</h1>
          <p className="text-lg text-gray-600">
            Área em construção - Conteúdo será adicionado em breve
          </p>
        </div>

        {/* Empty Content Card */}
        <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl">
          <CardContent className="p-12 text-center">
            <div className="text-gray-400 mb-4">
              <Building2 size={64} className="mx-auto" />
            </div>
            <h2 className="text-2xl font-semibold text-gray-700 mb-4">
              Portal em Desenvolvimento
            </h2>
            <p className="text-gray-500 max-w-md mx-auto">
              Esta página está sendo preparada para receber o conteúdo do Portal do BPO. 
              Em breve, você encontrará aqui todas as funcionalidades necessárias.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}