export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instanciate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "12.2.3 (519615d)"
  }
  public: {
    Tables: {
      candidaturas: {
        Row: {
          created_at: string
          curriculo: string | null
          email: string
          endereco: string
          experiencias: string | null
          id: string
          nome: string
          sobre_mim: string | null
          status: string
          telefone: string
          updated_at: string
          vaga_id: string
        }
        Insert: {
          created_at?: string
          curriculo?: string | null
          email: string
          endereco: string
          experiencias?: string | null
          id?: string
          nome: string
          sobre_mim?: string | null
          status?: string
          telefone: string
          updated_at?: string
          vaga_id: string
        }
        Update: {
          created_at?: string
          curriculo?: string | null
          email?: string
          endereco?: string
          experiencias?: string | null
          id?: string
          nome?: string
          sobre_mim?: string | null
          status?: string
          telefone?: string
          updated_at?: string
          vaga_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "candidaturas_vaga_id_fkey"
            columns: ["vaga_id"]
            isOneToOne: false
            referencedRelation: "vagas"
            referencedColumns: ["id"]
          },
        ]
      }
      cargos: {
        Row: {
          beneficios: string[]
          carencia: number
          created_at: string
          habilidades_especificas: string[]
          habilidades_esperadas: string[]
          id: string
          nivel: string
          nome: string
          responsabilidades: string[]
          salario_base: string
          status: string
          updated_at: string
        }
        Insert: {
          beneficios?: string[]
          carencia?: number
          created_at?: string
          habilidades_especificas?: string[]
          habilidades_esperadas?: string[]
          id?: string
          nivel: string
          nome: string
          responsabilidades?: string[]
          salario_base: string
          status?: string
          updated_at?: string
        }
        Update: {
          beneficios?: string[]
          carencia?: number
          created_at?: string
          habilidades_especificas?: string[]
          habilidades_esperadas?: string[]
          id?: string
          nivel?: string
          nome?: string
          responsabilidades?: string[]
          salario_base?: string
          status?: string
          updated_at?: string
        }
        Relationships: []
      }
      compromissos: {
        Row: {
          concluido: boolean
          created_at: string
          criado_por: string
          data: string
          descricao: string | null
          horario: string
          id: string
          participantes: string[]
          prioridade: string
          tipo: string
          titulo: string
          updated_at: string
        }
        Insert: {
          concluido?: boolean
          created_at?: string
          criado_por: string
          data: string
          descricao?: string | null
          horario: string
          id?: string
          participantes?: string[]
          prioridade?: string
          tipo: string
          titulo: string
          updated_at?: string
        }
        Update: {
          concluido?: boolean
          created_at?: string
          criado_por?: string
          data?: string
          descricao?: string | null
          horario?: string
          id?: string
          participantes?: string[]
          prioridade?: string
          tipo?: string
          titulo?: string
          updated_at?: string
        }
        Relationships: []
      }
      denuncias: {
        Row: {
          assunto: string
          consequencias: string | null
          created_at: string
          data_envio: string
          data_ocorrencia: string | null
          descricao: string
          id: string
          nome_envolvido: string | null
          resolucao: string | null
          setor: string
          status: string
          testemunhas: string | null
          tipo: string
          updated_at: string
        }
        Insert: {
          assunto: string
          consequencias?: string | null
          created_at?: string
          data_envio?: string
          data_ocorrencia?: string | null
          descricao: string
          id?: string
          nome_envolvido?: string | null
          resolucao?: string | null
          setor: string
          status?: string
          testemunhas?: string | null
          tipo: string
          updated_at?: string
        }
        Update: {
          assunto?: string
          consequencias?: string | null
          created_at?: string
          data_envio?: string
          data_ocorrencia?: string | null
          descricao?: string
          id?: string
          nome_envolvido?: string | null
          resolucao?: string | null
          setor?: string
          status?: string
          testemunhas?: string | null
          tipo?: string
          updated_at?: string
        }
        Relationships: []
      }
      funcionario_historico: {
        Row: {
          created_at: string
          descricao: string
          funcionario_id: string
          id: string
          tipo: string
          titulo: string
          updated_at: string
          usuario: string
        }
        Insert: {
          created_at?: string
          descricao: string
          funcionario_id: string
          id?: string
          tipo: string
          titulo: string
          updated_at?: string
          usuario?: string
        }
        Update: {
          created_at?: string
          descricao?: string
          funcionario_id?: string
          id?: string
          tipo?: string
          titulo?: string
          updated_at?: string
          usuario?: string
        }
        Relationships: []
      }
      funcionarios: {
        Row: {
          cargo: string
          created_at: string
          data_admissao: string | null
          departamento: string
          email: string | null
          foto_url: string | null
          id: string
          nome: string
          salario: number | null
          status: string
          telefone: string | null
          updated_at: string
        }
        Insert: {
          cargo: string
          created_at?: string
          data_admissao?: string | null
          departamento: string
          email?: string | null
          foto_url?: string | null
          id?: string
          nome: string
          salario?: number | null
          status?: string
          telefone?: string | null
          updated_at?: string
        }
        Update: {
          cargo?: string
          created_at?: string
          data_admissao?: string | null
          departamento?: string
          email?: string | null
          foto_url?: string | null
          id?: string
          nome?: string
          salario?: number | null
          status?: string
          telefone?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      funcionarios_sync: {
        Row: {
          bairro: string | null
          cargo: string
          cep: string | null
          cidade: string | null
          complemento: string | null
          cpf: string | null
          created_at: string | null
          ctps_estado: string | null
          ctps_numero: string | null
          ctps_serie: string | null
          data_admissao: string | null
          data_fim_aviso_previo: string | null
          data_fim_experiencia: string | null
          data_inativacao: string | null
          data_nascimento: string | null
          email: string | null
          endereco: string | null
          estado: string | null
          estado_civil: string | null
          foto: string | null
          funcionario_id: number
          id: number
          motivo_inativacao: string | null
          nacionalidade: string | null
          naturalidade: string | null
          nome: string
          nome_conjuge: string | null
          nome_mae: string | null
          nome_pai: string | null
          numero: string | null
          orgao_emissor_rg: string | null
          possui_auxilio_moradia: string | null
          possui_vale_alimentacao: string | null
          quantidade_vales: string | null
          raca_etnia: string | null
          rg: string | null
          salario: string | null
          setor: string | null
          status: string | null
          telefone: string | null
          updated_at: string | null
          vale_transporte: string | null
          valor_auxilio_moradia: string | null
          valor_vale_alimentacao: string | null
          valor_vale_transporte: string | null
        }
        Insert: {
          bairro?: string | null
          cargo: string
          cep?: string | null
          cidade?: string | null
          complemento?: string | null
          cpf?: string | null
          created_at?: string | null
          ctps_estado?: string | null
          ctps_numero?: string | null
          ctps_serie?: string | null
          data_admissao?: string | null
          data_fim_aviso_previo?: string | null
          data_fim_experiencia?: string | null
          data_inativacao?: string | null
          data_nascimento?: string | null
          email?: string | null
          endereco?: string | null
          estado?: string | null
          estado_civil?: string | null
          foto?: string | null
          funcionario_id: number
          id?: number
          motivo_inativacao?: string | null
          nacionalidade?: string | null
          naturalidade?: string | null
          nome: string
          nome_conjuge?: string | null
          nome_mae?: string | null
          nome_pai?: string | null
          numero?: string | null
          orgao_emissor_rg?: string | null
          possui_auxilio_moradia?: string | null
          possui_vale_alimentacao?: string | null
          quantidade_vales?: string | null
          raca_etnia?: string | null
          rg?: string | null
          salario?: string | null
          setor?: string | null
          status?: string | null
          telefone?: string | null
          updated_at?: string | null
          vale_transporte?: string | null
          valor_auxilio_moradia?: string | null
          valor_vale_alimentacao?: string | null
          valor_vale_transporte?: string | null
        }
        Update: {
          bairro?: string | null
          cargo?: string
          cep?: string | null
          cidade?: string | null
          complemento?: string | null
          cpf?: string | null
          created_at?: string | null
          ctps_estado?: string | null
          ctps_numero?: string | null
          ctps_serie?: string | null
          data_admissao?: string | null
          data_fim_aviso_previo?: string | null
          data_fim_experiencia?: string | null
          data_inativacao?: string | null
          data_nascimento?: string | null
          email?: string | null
          endereco?: string | null
          estado?: string | null
          estado_civil?: string | null
          foto?: string | null
          funcionario_id?: number
          id?: number
          motivo_inativacao?: string | null
          nacionalidade?: string | null
          naturalidade?: string | null
          nome?: string
          nome_conjuge?: string | null
          nome_mae?: string | null
          nome_pai?: string | null
          numero?: string | null
          orgao_emissor_rg?: string | null
          possui_auxilio_moradia?: string | null
          possui_vale_alimentacao?: string | null
          quantidade_vales?: string | null
          raca_etnia?: string | null
          rg?: string | null
          salario?: string | null
          setor?: string | null
          status?: string | null
          telefone?: string | null
          updated_at?: string | null
          vale_transporte?: string | null
          valor_auxilio_moradia?: string | null
          valor_vale_alimentacao?: string | null
          valor_vale_transporte?: string | null
        }
        Relationships: []
      }
      vagas: {
        Row: {
          beneficios: string | null
          cidade: string
          created_at: string
          criado_por: string
          departamento: string
          descricao: string | null
          id: string
          requisitos: string | null
          salario: string | null
          status: string
          tipo: string
          titulo: string
          updated_at: string
        }
        Insert: {
          beneficios?: string | null
          cidade: string
          created_at?: string
          criado_por: string
          departamento: string
          descricao?: string | null
          id?: string
          requisitos?: string | null
          salario?: string | null
          status?: string
          tipo: string
          titulo: string
          updated_at?: string
        }
        Update: {
          beneficios?: string | null
          cidade?: string
          created_at?: string
          criado_por?: string
          departamento?: string
          descricao?: string | null
          id?: string
          requisitos?: string | null
          salario?: string | null
          status?: string
          tipo?: string
          titulo?: string
          updated_at?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
